package gql_logger

import (
	"go.uber.org/zap"
	"testing"
)

func TestNewLogger(t *testing.T) {
	l := NewLogger(NewStdLogger())
	l.SetZap(l.Strict().With(zap.String("key", "keyValue")))
	l.Sugared().Error("test")
}
