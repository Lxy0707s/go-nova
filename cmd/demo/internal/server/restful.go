package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/demo/service"
	khttp "github.com/go-nova/pkg/core/transport/http"
)

// RegisterRestfulRouteV1 注册gin路由
func RegisterRestfulRouteV1(r *gin.Engine, s *http.Server) {
	// gin 路由初始化
	route := r.Group("/api")
	// 各个组件服务注册路由支线
	service.RouteV1(route)
}

// RegisterRestfulRouteV2 注册系统自带路由
func RegisterRestfulRouteV2(httpSrv *khttp.Server) {
	route := httpSrv.Route("/api")
	service.RouteV2(route)
}
