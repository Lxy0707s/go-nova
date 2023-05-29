package kgin

import (
	"context"
	"github.com/gin-gonic/gin"
	"github.com/go-nova/pkg/common/middleware"
	"github.com/go-nova/pkg/utils/errors"
	thttp "github.com/go-nova/pkg/utils/transport/http"
)

// Middlewares return middlewares wrapper
func Middlewares(m ...middleware.Middleware) gin.HandlerFunc {
	chain := middleware.Chain(m...)
	return func(c *gin.Context) {
		next := func(ctx context.Context, req interface{}) (interface{}, error) {
			c.Next()
			var err error
			if c.Writer.Status() >= 400 {
				err = errors.Errorf(c.Writer.Status(), errors.UnknownReason, errors.UnknownReason)
			}
			return c.Writer, err
		}
		next = chain(next)
		ctx := NewGinContext(c.Request.Context(), c)
		c.Request = c.Request.WithContext(ctx)
		if ginCtx, ok := FromGinContext(ctx); ok {
			thttp.SetOperation(ctx, ginCtx.FullPath())
		}
		next(c.Request.Context(), c.Request)
	}
}

type ginKey struct{}

// NewGinContext returns a new Context that carries gin.Context value.
func NewGinContext(ctx context.Context, c *gin.Context) context.Context {
	return context.WithValue(ctx, ginKey{}, c)
}

// FromGinContext returns the gin.Context value stored in ctx, if any.
func FromGinContext(ctx context.Context) (c *gin.Context, ok bool) {
	c, ok = ctx.Value(ginKey{}).(*gin.Context)
	return
}
