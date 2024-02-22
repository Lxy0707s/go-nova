package user

import (
	"github.com/gin-gonic/gin"
	"github.com/go-nova/cmd/polaris/module/demo/user_service"
)

// GetUser
func GetUser(ctx *gin.Context) {
	// 数据库查询示例
	u := user_service.QueryUser()
	ctx.JSON(200, u)
}
