package user_restful

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/polaris/module/demo/user_restful/user"
)

var routeModuleV1 = "v1"

func RouteV1(router *gin.RouterGroup) {
	router = router.Group(routeModuleV1)
	restfulApiV1(router)
}

func restfulApiV1(router *gin.RouterGroup) {
	// 代理接口，发起请求
	//router.GET("/test", hello.Hello)
	router.GET("/user", user.GetUser)
}
