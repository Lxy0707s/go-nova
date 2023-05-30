package user_service

import (
	"fmt"
	"github.com/go-nova/cmd/demo/module/demo/dal"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func QueryUser() {
	// 数据库连接信息
	dsn := "root:admin123@tcp(127.0.0.1:3306)/nova?charset=utf8mb4&parseTime=True&loc=Local"

	// 连接数据库
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	dal.SetDefault(db)

	// query the first user
	user, _ := dal.Q.User.First()

	fmt.Println(user.Name, user.Address)
}
