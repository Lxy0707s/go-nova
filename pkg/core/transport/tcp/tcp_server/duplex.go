package tcp_server

import (
	"fmt"
	"github.com/aceld/zinx/ziface"
	"github.com/aceld/zinx/znet"
)

type RDuplex struct {
	znet.BaseRouter
}

func (rd *RDuplex) Handle(request ziface.IRequest) {
	fmt.Printf("receive from client msgID=%d, data=%s\n", request.GetMsgID(), string(request.GetData()))
	err := request.GetConnection().SendMsg(2, []byte("hello zix hello Router"))
	if err != nil {
		fmt.Println(err)
	}
}
