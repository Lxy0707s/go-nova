package hello

import "github.com/gin-gonic/gin"

// Hello 代理转发api服务请求
func Hello(ctx *gin.Context) {
	ctx.JSON(200, map[string]string{"data": "hello"})
}
