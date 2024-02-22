package api_server

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/polaris/internal/graphql"
)

func RegisterGraphqlRoute(r *gin.Engine, isDebug bool) {
	graphql.RegisterGraphqlRoute(r, isDebug) // 注册graphql api路由
}
