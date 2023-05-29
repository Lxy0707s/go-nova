package main

import (
	"github.com/go-nova/cmd/demo/curtain"
	"github.com/go-nova/cmd/demo/internal/server"
	"github.com/go-nova/pkg/common/app"
	"github.com/go-nova/pkg/utils/transport/http"
)

/**
 * 基于kratos开源方案魔改
 * 使用http服务整合gin框架服务
 */
func main() {
	httpSrv := http.NewServer(http.Address(":8080"))
	exec := app.New(
		app.Name("my-nova"),
		app.Version(release),
		app.BuildTime(buildTime),
		app.Server(
			httpSrv,
		),
	)

	curtain.CurtainGenerator(exec.Name(), "xuanyu.li", exec.Version(), exec.BuildTime(), "")

	server.RegisterRestful(httpSrv, false)
	err := exec.Run()
	if err != nil {
		return
	}
}
