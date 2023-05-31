package dao

import (
	"context"
	"fmt"
	"gorm.io/driver/mysql"
	"log"
	"time"

	"gorm.io/gorm"
)

var (
	// MysqlStore 数据库配置
	// MysqlStore []Option

	// DBMap 数据库多实例
	DBMap map[string]*gorm.DB
)

// Option 数据库配置
type Option struct {
	Driver   string   `json:"driver,omitempty" yaml:"driver"`
	Username string   `json:"username,omitempty" yaml:"username"`
	Password string   `json:"password,omitempty" yaml:"password"`
	Network  string   `json:"network,omitempty" yaml:"network"`
	DBNames  []string `json:"db_names,omitempty" yaml:"db_names"` // 多数据库
	DBPrefix string   `json:"db_prefix,omitempty" yaml:"db_prefix"`
}

// Model 基本类型，自带添加时间和更新时间
type Model struct {
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Extra 增加外部数据，标记不要 db 查询，json 渲染
type Extra struct {
	Ctx context.Context `json:"-" gorm:"-"`
}

// Setup 注册数据库，如果有问题会 panic
func Setup(option interface{}) map[string]*gorm.DB {
	switch option.(type) {
	case Option:
		DBMap = initDbConfig(option.(Option))
	case []Option:
		// MysqlStore = option.([]Option)
		for _, dbConfig := range option.([]Option) {
			DBMap = initDbConfig(dbConfig)
		}
	}
	return DBMap
}

func initDbConfig(option Option) map[string]*gorm.DB {
	if option.Network == "" {
		return nil
	}
	if DBMap == nil {
		DBMap = make(map[string]*gorm.DB)
	}

	var err error
	for _, name := range option.DBNames {
		key := option.DBPrefix + name
		// // 连接数据库
		dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8&parseTime=True&loc=Local&maxAllowedPacket=%d",
			option.Username,
			option.Password,
			option.Network,
			key,
			0,
		)
		//	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
		DBMap[key], err = gorm.Open(mysql.Open(dsn), &gorm.Config{}) // gorm.Open(option.Driver, dsn)
		if err != nil {
			panic(fmt.Errorf("db '%s' error: %v", key, err))
		}
		// tracemid.GormV1TraceInitialize(DBMap[key])
	}
	return DBMap
}

// CloseDB 关闭数据库
func CloseDB(option interface{}) {
	switch option.(type) {
	case Option:
		_closeDB(option.(Option))
	case []Option:
		for _, dbConfig := range option.([]Option) {
			_closeDB(dbConfig)
		}
	}
}

func _closeDB(option Option) {
	for _, name := range option.DBNames {
		key := option.DBPrefix + name
		db, err := DBMap[key].DB()

		if err != nil {
			return
		}

		err = db.Close()
		if err != nil {
			return
		}
		if err != nil {
			log.Fatalf("close err: %v", err)
		}
	}
}
