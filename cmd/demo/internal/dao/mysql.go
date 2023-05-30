package dao

import (
	"database/sql"
	"github.com/go-nova/pkg/common/dao"
	"time"
)

func NovaDao() *sql.DB {
	sqlDB, _ := dao.DBMap["nova"].DB()
	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
	sqlDB.SetMaxIdleConns(10)
	// SetMaxOpenConns sets the maximum number of open connections to the database.
	sqlDB.SetMaxOpenConns(100)
	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	sqlDB.SetConnMaxLifetime(time.Hour)

	// todo
	return sqlDB
}
