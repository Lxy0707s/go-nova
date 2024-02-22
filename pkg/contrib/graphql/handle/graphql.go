package handle

import (
	"encoding/json"
	navErr "errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-nova/pkg/contrib/graphql/gql_errors"
	"github.com/graph-gophers/graphql-go"
	gErrprs "github.com/graph-gophers/graphql-go/errors"
	"github.com/opentracing/opentracing-go"
	"net/http"
	"strings"
	"sync"
)

type query struct {
	Query         string                 `json:"query"`
	OperationName string                 `json:"operationName"`
	Variables     map[string]interface{} `json:"variables"`
}

type request struct {
	queries []query
	isBatch bool
}

type GraphQLResponses struct {
	Code   int32                   `json:"code"`
	Data   *json.RawMessage        `json:"data"`
	Msg    string                  `json:"msg"`
	Errors [][]*gErrprs.QueryError `json:"errors,omitempty"`
}

type BatchGraphQLResponses struct {
	Code   int32                   `json:"code"`
	Data   []*json.RawMessage      `json:"data"`
	Msg    string                  `json:"msg"`
	Errors [][]*gErrprs.QueryError `json:"errors,omitempty"`
}

type GraphQL struct {
	Schema  *graphql.Schema
	Loaders Collection
	Debug   bool
	//CheckAccess *auth_jwt.CheckAccess
}

func GraphqlServeResource(r *gin.RouterGroup, graphqlSchema *graphql.Schema, sysDebug bool) {
	h := &GraphQL{
		Schema:  graphqlSchema,
		Loaders: NewLoaderCollection(),
		Debug:   sysDebug,
		//CheckAccess: app.CheckAccessMiddleware,
	}

	r.POST("query", h.Query)
}

var (
	wg   sync.WaitGroup
	code int32 = 0
	msg        = ""
)

func (t *GraphQL) Query(c *gin.Context) {
	req, err := parse(c.Request)
	if err != nil {
		fmt.Println("query-err", err)
		err = c.AbortWithError(http.StatusBadRequest, err)
		if err != nil {
		}
		return
	}
	n := len(req.queries)
	if n == 0 {
		fmt.Println("query-err", "err-request")
		err = c.AbortWithError(http.StatusBadRequest, navErr.New("err-request"))
		if err != nil {
		}
		return
	}

	var (
		ctx        = t.Loaders.Attach(c)
		responses  = make([]*json.RawMessage, n)
		gResponses = make([]*graphql.Response, n)
		gErrors    = make([][]*gErrprs.QueryError, n)
		isSchema   = false
	)
	spanCtx, _ := TraceSpanFromContext(c)
	if spanCtx != nil {
		span := opentracing.StartSpan(c.Request.RequestURI, opentracing.ChildOf(spanCtx))
		ctx = opentracing.ContextWithSpan(ctx, span)
		defer span.Finish()
	}

	if strings.Contains(req.queries[0].Query, "__schema") {
		isSchema = true
	}

	wg.Add(n)
	for i, q := range req.queries {
		go func(i int, q query) {
			res := t.Schema.Exec(ctx, q.Query, q.OperationName, q.Variables)
			res.Errors = gql_errors.Expand(res.Errors)
			if len(res.Errors) > 0 {
				code = 400
				msg = res.Errors[0].Message
				gErrors[i] = res.Errors
			}
			//res.Data = ad
			responses[i] = &res.Data
			gResponses[i] = res
			wg.Done()
		}(i, q)
	}
	wg.Wait()
	var lenRes = len(responses)

	//常规查询
	if !isSchema { // 普通查询，非系统查询
		if req.isBatch {
			batchGraphQLResponses := &BatchGraphQLResponses{
				Code: code,
				Data: responses,
				Msg:  msg,
			}
			if gErrors[0] != nil {
				batchGraphQLResponses.Errors = gErrors
			}
			c.JSON(200, batchGraphQLResponses)
			return
		}

		if lenRes > 0 { //为了满足iql响应需额外处理，iql取的不是切片格式
			graphQLResponses := &GraphQLResponses{
				Code: code,
				Data: responses[0],
				Msg:  msg,
			}
			if gErrors[0] != nil {
				graphQLResponses.Errors = gErrors
			}

			c.JSON(200, graphQLResponses)
			return
		}

	}

	if t.Debug { //如果来自系统常量的查询，并且开启debug
		if req.isBatch {
			c.JSON(200, gResponses)
			return
		}

		if lenRes > 0 { //为了满足iql响应需额外处理，iql取的不是切片格式
			c.JSON(200, gResponses[0]) // len = 19490
			return
		}
	}

	//未开启debug, 仅仅对api数据应用
	GraphQLResponses := &GraphQLResponses{
		Code: 403,
		Msg:  "without permission",
	}

	c.JSON(403, GraphQLResponses)
}
