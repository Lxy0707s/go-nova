package user_restful

import (
	"github.com/go-nova/cmd/demo/module/demo/user_restful/hello"
	khttp "github.com/go-nova/pkg/core/transport/http"
	"log"
	"net/http"
)

var routeModuleV2 = "v2"

func RouteV2(route *khttp.Router) {
	route = route.Group(routeModuleV2, authFilter)
	restfulApiV2(route)
}

func restfulApiV2(route *khttp.Router) {
	route.GET("/test", hello.Hello2)
}

// 路由级别过滤拦截器
func authFilter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println("scheme:", r.Method, "url_path:", r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
