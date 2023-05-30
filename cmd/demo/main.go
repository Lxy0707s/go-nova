package main

import (
	"github.com/go-nova/cmd/demo/curtain"
	"github.com/go-nova/cmd/demo/internal/config"
	"github.com/go-nova/cmd/demo/internal/server"
	"github.com/go-nova/cmd/demo/module/demo/user_service"
	"github.com/go-nova/pkg/common/app"
	"github.com/go-nova/pkg/core/transport/http"
)

const configName = "config.yaml"

/**
 * 基于kratos开源方案魔改
 * 使用http服务整合gin框架服务
 */
func main() {
	// 创建服务
	httpSrv := http.NewServer(http.Address(":8080"))
	exec := app.New(
		app.Name("my-nova"),
		app.Version(release),
		app.BuildTime(buildTime),
		app.Server(
			httpSrv,
		),
	)
	// 展示欢迎logo
	curtain.CurtainGenerator(exec.Name(), "xuanyu.li", exec.Version(), exec.BuildTime(), "")
	// 加载配置
	config.InitConfig(configName)
	// 数据库查询示例
	user_service.QueryUser()

	// http服务注册
	server.RegisterRestful(httpSrv, true)
	err := exec.Run()
	if err != nil {
		return
	}
}
