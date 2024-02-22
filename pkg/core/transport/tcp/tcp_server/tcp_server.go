package tcp_server

import (
	"context"
	"github.com/aceld/zinx/zconf"
	"github.com/aceld/zinx/ziface"
	"github.com/aceld/zinx/znet"
	log2 "github.com/go-nova/pkg/core/log"
	"strconv"
	"sync"
)

type TcpServer struct {
	server ziface.IServer
	lock   sync.RWMutex
}

var (
	instance *TcpServer
	addr     string
)

func NewServer(config *zconf.Config) *TcpServer {
	if config == nil {
		log2.Error("[Zinx-TCP] server config is null. server start error")
		return nil
	}
	addr = "[::]" + strconv.Itoa(config.TCPPort)
	// 创建 Zinx 服务器
	if instance == nil {
		server := znet.NewUserConfServer(config)

		server.SetOnConnStart(ConnStart)
		server.SetOnConnStop(ConnLost)
		instance = &TcpServer{server: server}
	}
	return instance
}

func (ts *TcpServer) Start(ctx context.Context) error {
	//s.AddRouter(1001, &RSimple{}) // 单向通信，边缘主动，服务端收到信息后，只返回收到
	//s.AddRouter(1002, &RDuplex{}) // 双工通信， 边缘和中心即时通信
	log2.Infof("[Zinx-TCP] server listening on: %s", addr)
	ts.server.Serve()

	select {}
}

func (ts *TcpServer) restartServer() {
	ts.server.Stop()
}

func (ts *TcpServer) RegisterRouter(uid uint32, router ziface.IRouter) {
	if ts.server == nil {
		return
	}
	//ts.restartServer()
	ts.server.AddRouter(uid, router)
}

func (ts *TcpServer) Stop(ctx context.Context) error {
	log2.Info("[Zinx-TCP] server stopping")
	ts.server.Stop()
	return nil
}
