package app_log

import (
	myzap "github.com/go-nova/pkg/contrib/log/zap/v2"
	"github.com/go-nova/pkg/core/log"
)

func InitLogInstance() *log.Logger {
	logger := myzap.NewLoggerInstance("level", "note", "app_log")
	defer func() { _ = logger.Close() }()

	return logger
}
