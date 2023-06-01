package tcp_server

import (
	"fmt"
	"github.com/aceld/zinx/ziface"
	"github.com/aceld/zinx/znet"
)

// RSimple MsgId=1 的路由
type RSimple struct {
	znet.BaseRouter
}

// Handle Simple Handle MsgId=1的路由处理方法
func (rs *RSimple) Handle(request ziface.IRequest) {
	//读取客户端的数据
	fmt.Println("recv from client : msgId=", request.GetMsgID(), ", data=", string(request.GetData()))
}
