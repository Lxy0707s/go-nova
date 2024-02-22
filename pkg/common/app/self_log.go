package app

import (
	myzap "github.com/go-nova/pkg/contrib/log/zap"
	"github.com/go-nova/pkg/core/log"
)

func SetGlobalLogger() {
	zlog := myzap.NewLoggerInstance("level", "note", "app_log")
	defer func() { _ = zlog.Close() }()
	log.SetLogger(zlog)
}
