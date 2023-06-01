package tcp_server

import (
	"github.com/aceld/zinx/ziface"
	"github.com/aceld/zinx/znet"
	"sync"
)

type TcpServer struct {
	server ziface.IServer
	lock   sync.RWMutex
}

var instance *TcpServer

func NewServer() *TcpServer {
	if instance == nil {
		server := znet.NewServer()

		server.SetOnConnStart(ConnStart)
		server.SetOnConnStop(ConnLost)
		instance = &TcpServer{server: server}
	}
	return instance
}

func (ts *TcpServer) Start() {
	//s.AddRouter(1001, &RSimple{}) // 单向通信，边缘主动，服务端收到信息后，只返回收到
	//s.AddRouter(1002, &RDuplex{}) // 双工通信， 边缘和中心即时通信

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

func (ts *TcpServer) Stop() {
	ts.server.Stop()
}
