package api_server

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/demo/internal/api_server/middleware"
	"github.com/go-nova/pkg/common/middleware/recovery"
	khttp "github.com/go-nova/pkg/core/transport/http"
	"github.com/go-nova/pkg/utils/kgin"
)

// RegisterRestful 各个服务注册路由总线
func RegisterRestful(httpSrv *khttp.Server, useGin bool) {

	if useGin {
		// 使用gin代替默认的http服务
		useGinHttpServer(httpSrv)
	} else {
		RegisterRestfulRouteV2(httpSrv)
	}
}

func useGinHttpServer(httpSrv *khttp.Server) {
	r := gin.Default()
	// 使用kratos中间件
	r.Use(kgin.Middlewares(recovery.Recovery(), middleware.CustomMiddleware)) //middleware.CustomMiddleware
	go RegisterRestfulRouteV1(r, nil)
	go RegisterGraphqlRoute(r)
	httpSrv.HandlePrefix("/", r)
}
