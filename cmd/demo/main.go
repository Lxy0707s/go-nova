package main

import (
	"github.com/go-nova/cmd/demo/curtain"
	"github.com/go-nova/cmd/demo/internal/config"
	"github.com/go-nova/cmd/demo/internal/server"
	"github.com/go-nova/pkg/common/app"
	"github.com/go-nova/pkg/common/dao"
	"github.com/go-nova/pkg/core/transport/http"
	"strconv"
)

const (
	configName  = "config.yaml"
	appName     = "nova"
	defaultPort = ":8080"
)

/**
 * 基于kratos开源方案魔改
 * 使用http服务整合gin框架服务
 */
func main() {
	// 展示欢迎logo
	curtain.CurtainGenerator(appName, "xuanyu.li", release, buildTime, "")
	// 加载配置
	config.InitConfig(configName)
	port := defaultPort
	if config.AppCfg.Server.Port != 0 {
		port = ":" + strconv.Itoa(config.AppCfg.Server.Port)
	}
	// 创建服务
	httpSrv := http.NewServer(http.Address(port))
	exec := app.New(
		app.Name(appName),
		app.Version(release),
		app.BuildTime(buildTime),
		app.Server(
			httpSrv,
		),
	)

	// 加载数据库
	dao.Setup(config.AppCfg.Database)

	// http服务注册,开启http server服务，可选择使用自带服务和gin服务
	server.RegisterRestful(httpSrv, true)
	err := exec.Run()
	if err != nil {
		return
	}
}
