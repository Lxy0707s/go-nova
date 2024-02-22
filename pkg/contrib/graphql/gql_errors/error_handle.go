package gql_errors

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/pkg/contrib/graphql/gql_logger"
	"go.uber.org/zap"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

var ErrMessage *ErrorMessage

func ErrorHandle(config map[string]interface{}, logger *gql_logger.Logger) gin.HandlerFunc {
	bytes, err := ioutil.ReadFile(config["error-template"].(string))
	if err != nil {
		panic(err)
	}
	templates := map[string]ErrorTemplate{}
	yaml.Unmarshal(bytes, &templates)
	ErrMessage = NewErrorMessage(&templates)

	return func(c *gin.Context) {
		c.Next()
		if l := len(c.Errors); l > 0 {
			var (
				errArray = make([]*ErrorDescription, l)
				status   = 500
			)

			for i, e := range c.Errors {
				logger.Strict().Error(e.Err.Error(), defaultFields(c)...)
				errArray[i] = ErrMessage.GetErrorDescription(e.Err)
			}

			if c.IsAborted() {
				status = c.Writer.Status()
			} else if c := errArray[0].Code; c != 0 {
				status = c
			}

			c.JSON(status, gin.H{
				"errors": errArray,
			})
		}
	}
}

// 默认需要记录的上下文信息
func defaultFields(c *gin.Context) (fs []zap.Field) {
	if tid := c.GetString(gql_logger.ContextHeaderName); tid != "" {
		fs = append(fs, zap.String(gql_logger.TraceIdKey, tid))
	}
	return fs
}
