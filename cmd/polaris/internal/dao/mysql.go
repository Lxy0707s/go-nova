package dao

import (
	"github.com/go-nova/pkg/common/dao"
	"gorm.io/gorm"
)

//SetMaxIdleConns(n int)：设置连接池中最大的空闲连接数。默认值为 2。
//SetMaxOpenConns(n int)：设置连接池中最大的连接数。默认值为 0，表示不限制。
//SetConnMaxIdleTime(d time.Duration)：设置连接最大空闲时间。默认值为 0，表示不限制。
//SetConnMaxLifetime(d time.Duration)：设置连接最大生命周期。默认值为 0，表示不限制。

func NovaDao() *gorm.DB {
	/*sqlDB, _ := dao.DBMap["nova"].DB()

	// SetMaxOpenConns sets the maximum number of open connections to the database.
	// 设置连接数总数, 需要根据实际业务来测算, 应小于 mysql.max_connection (应该远远小于), 后续根据指标进行调整
	sqlDB.SetMaxOpenConns(100)
	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
	// 设置最大空闲连接数, 该数值应该小于等于 SetMaxOpenConns 设置的值
	sqlDB.SetMaxIdleConns(50)
	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	// 设置连接最大生命周期, 默认为 0(不限制), time.Hour
	sqlDB.SetConnMaxLifetime(0)
	// 设置空闲状态最大生命周期, 该值应小于 mysql.wait_timeout 的值, 以避免被服务端断开连接, 产生报错影响业务， 一般可以配置 1天。
	sqlDB.SetConnMaxIdleTime(5 * time.Minute)*/

	//defer db.Close()
	// todo
	return dao.DBMap["polaris"]
}
