package middleware

import (
	"context"
	"github.com/go-nova/pkg/common/middleware"
)

func CustomMiddleware(handler middleware.Handler) middleware.Handler {
	return func(ctx context.Context, req interface{}) (reply interface{}, err error) {
		//if tr, ok := transport.FromServerContext(ctx); ok {
		//	fmt.Println("url_path:", tr.Operation())
		//}
		reply, err = handler(ctx, req)
		return
	}
}
