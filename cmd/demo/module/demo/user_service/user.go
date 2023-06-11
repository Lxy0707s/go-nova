package user_service

import (
	"github.com/go-nova/cmd/demo/internal/dao"
	"github.com/go-nova/cmd/demo/internal/dao/model"
	"github.com/go-nova/cmd/demo/module/demo/query"
)

func QueryUser() *model.User {
	// 数据库连接信息
	// dsn := "root:admin123@tcp(127.0.0.1:3306)/nova?charset=utf8mb4&parseTime=True&loc=Local"

	// 连接数据库
	db := dao.NovaDao()

	query.SetDefault(db)

	// query the first user
	user, _ := query.Q.User.First()

	return user
}
