package server

import (
	"github.com/gin-gonic/gin"
	kgin "github.com/go-kratos/gin"
	"github.com/go-nova/cmd/demo/internal/server/middleware"
	"github.com/go-nova/pkg/common/middleware/recovery"
	khttp "github.com/go-nova/pkg/utils/transport/http"
	"log"
	"net/http"
)

func HttpSrv(r *gin.Engine, httpSrv *khttp.Server) {
	// 使用kratos中间件
	r.Use(kgin.Middlewares(recovery.Recovery(), middleware.CustomMiddleware)) //middleware.CustomMiddleware

	// 各个服务注册路由总线
	RegisterRestfulRoute(r, httpSrv)

	httpSrv.HandlePrefix("/", r)
}

type Test struct {
	Name string
}

func HttpDeSrv(route *khttp.Router) {
	route.GET("/users/{name}", func(ctx khttp.Context) error {
		u := new(Test)
		u.Name = ctx.Vars().Get("name")
		return ctx.Result(200, u)
	}, authFilter)
}

func authFilter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println("auth:", r.Method, r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
