package zap

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
)

var encoderCfg = zapcore.EncoderConfig{
	LevelKey:       "level",
	NameKey:        "app",
	TimeKey:        "ts",
	EncodeLevel:    zapcore.LowercaseLevelEncoder,
	EncodeTime:     zapcore.RFC3339TimeEncoder, //ISO8601TimeEncoder
	EncodeDuration: zapcore.StringDurationEncoder,
}

func NewLoggerInstance(logName string) *Logger {
	core := zapcore.NewCore(
		zapcore.NewJSONEncoder(encoderCfg),
		zapcore.AddSync(os.Stdout),
		zap.NewAtomicLevelAt(zap.InfoLevel),
	)
	zlog := zap.New(core)

	defer zlog.Sync()

	zlog = zlog.Named(logName)
	logger := NewLogger(zlog)
	return logger
}
