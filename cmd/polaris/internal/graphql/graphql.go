package graphql

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/polaris/internal/graphql/schema"
	"github.com/go-nova/pkg/contrib/graphql/handle"
	"github.com/go-nova/pkg/contrib/graphql/playground"
	"github.com/graph-gophers/graphql-go"
)

func OpenGraphqlDebug(r *gin.Engine) {
	r.GET("/graphiql", gin.WrapF(playground.Handler("GraphQL", "/graphql/query")))
	r.GET("/playground", gin.WrapF(playground.AltairHandler("Altair", "/graphql/query")))
}

func RegisterGraphqlRoute(r *gin.Engine, isDebug bool) {
	if isDebug { // 是否开启调试，是则开启UI界面可视化调试
		OpenGraphqlDebug(r)
	}

	graphqlG := r.Group("/graphql")

	//注册各模块resolve
	graphqlResolver := RegisterResolver()

	graphqlSchema := graphql.MustParseSchema(schema.GetRootSchema(), graphqlResolver)

	handle.GraphqlServeResource(graphqlG, graphqlSchema, isDebug)
}
