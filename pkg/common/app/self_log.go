package app

import (
	myzap "github.com/go-nova/pkg/contrib/log/zap"
)

// NewAppLogger 可以单独使用，也可以集成进go-nove的server中作为全局logger使用
func NewAppLogger(appName string) *myzap.Logger {
	zlog := myzap.NewLoggerInstance(appName)
	defer func() { _ = zlog.Close() }()

	return zlog
}
