package main

import "github.com/go-nova/pkg/core/transport/tcp/tcp_client"

func main() {
	cli := tcp_client.NewClient()
	if cli == nil {
		return
	}
	cli.Start()
}
