package tcp

import (
	"github.com/go-nova/pkg/core/transport/tcp/tcp_client"
	"github.com/go-nova/pkg/core/transport/tcp/tcp_server"
	"testing"
)

func TestName(t *testing.T) {
	ins := tcp_server.NewServer()
	ins.RegisterRouter(uint32(1002), &tcp_server.RDuplex{})
	go ins.Start()

	cli := tcp_client.NewClient()
	go send(cli)
	cli.Start()
}

func send(cli *tcp_client.TcpClient) {
	for i := 0; i < 5; i++ {
		cli.Send([]byte("hello server"))
	}
}
