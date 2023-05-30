package server

import (
	"github.com/go-nova/cmd/demo/module/demo/user_restful"
	"net/http"

	"github.com/gin-gonic/gin"
	khttp "github.com/go-nova/pkg/core/transport/http"
)

// RegisterRestfulRouteV1 注册gin路由
func RegisterRestfulRouteV1(r *gin.Engine, s *http.Server) {
	// gin 路由初始化
	route := r.Group("/api")
	// 各个组件服务注册路由支线
	user_restful.RouteV1(route)
}

// RegisterRestfulRouteV2 注册系统自带路由
func RegisterRestfulRouteV2(httpSrv *khttp.Server) {
	route := httpSrv.Route("/api")
	user_restful.RouteV2(route)
}
