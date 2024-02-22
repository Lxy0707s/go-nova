package zap

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
)

func NewLoggerInstance(level, msgKey, nameKey string) *Logger {
	encoderCfg := zapcore.EncoderConfig{
		LevelKey:       level,
		MessageKey:     msgKey,
		NameKey:        nameKey,
		EncodeLevel:    zapcore.LowercaseLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
	}
	core := zapcore.NewCore(zapcore.NewJSONEncoder(encoderCfg), os.Stdout, zap.DebugLevel)
	zlog := zap.New(core).WithOptions()

	logger := NewLogger(zlog)
	return logger
}
