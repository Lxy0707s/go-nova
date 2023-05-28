package service

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/demo/service/hello"
)

var routeModuleName = "v1.0"

func RegisterRoute(router *gin.RouterGroup) {
	//	注册
	registerRestfulApiV1(router)
}

func registerRestfulApiV1(router *gin.RouterGroup) {
	router = router.Group(routeModuleName)
	// 代理接口，发起请求
	router.GET("/test", hello.Hello)
}
