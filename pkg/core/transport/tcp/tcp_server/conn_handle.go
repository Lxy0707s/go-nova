package tcp_server

import (
	"fmt"
	"github.com/aceld/zinx/ziface"
)

func ConnStart(conn ziface.IConnection) {
	err := conn.SendMsg(2, []byte("server conn is beginning..."))
	if err != nil {
		fmt.Println(err)
	}
}

func ConnLost(conn ziface.IConnection) {
	conn.Stop()
}
