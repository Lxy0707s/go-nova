package user_service

import (
	"github.com/go-nova/cmd/polaris/internal/dao"
	"github.com/go-nova/cmd/polaris/internal/dao/model"
	"github.com/go-nova/cmd/polaris/module/demo/dbutils"
)

func QueryUser() []model.SysUser {
	// 数据库连接信息
	// dsn := "root:admin123@tcp(127.0.0.1:3306)/nova?charset=utf8mb4&parseTime=True&loc=Local"

	// 连接数据库
	db := dao.NovaDao()

	dbutils.SetDefault(db)

	var User []model.SysUser
	// query the first user
	err := dbutils.Q.SysUser.Scan(&User)
	if err != nil {
		return nil
	}

	return User
}
