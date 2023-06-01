package tcp

import (
	"context"
	"github.com/aceld/zinx/zconf"
	"github.com/go-nova/pkg/core/transport/tcp/tcp_client"
	"github.com/go-nova/pkg/core/transport/tcp/tcp_server"
	"testing"
	"time"
)

func TestName(t *testing.T) {
	var config = &zconf.Config{
		Host:    "0.0.0.0",
		TCPPort: 8899,
	}

	ins := tcp_server.NewServer(config)
	ins.RegisterRouter(uint32(1002), &tcp_server.RDuplex{})
	ctx := context.Background()
	go ins.Start(ctx)

	time.Sleep(time.Second * 5)
	cli := tcp_client.NewClient()
	go send(cli)
	go cli.Start(ctx)
	<-time.After(time.Second * 15)
	ins.Stop(ctx)
	cli.Stop(ctx)
}

func send(cli *tcp_client.TcpClient) {
	for i := 0; i < 5; i++ {
		cli.Send([]byte("hello server"))
	}
}
