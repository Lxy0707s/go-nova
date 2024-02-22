package gql_errors

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/pkg/contrib/graphql/gql_logger"
	"testing"
)

func TestErrorHandle(t *testing.T) {
	config := map[string]interface{}{}
	efunc := ErrorHandle(config, gql_logger.NewLogger())

	efunc(&gin.Context{})
}
