package server

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/demo/service"
	"github.com/go-nova/pkg/utils/transport/http"
)

func RegisterRestfulRoute(r *gin.Engine, s *http.Server) {
	// gin 路由初始化
	apiG := r.Group("/api")
	// 各个组件服务注册路由支线
	service.RegisterRoute(apiG)
}
