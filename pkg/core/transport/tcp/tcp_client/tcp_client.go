package tcp_client

import (
	"context"
	"fmt"
	"github.com/aceld/zinx/ziface"
	"github.com/aceld/zinx/zpack"
	"io"
	"net"
	"sync"
	"time"
)

var hello = []byte("hello server")
var (
	sendData []byte
	recvData []byte
)

type (
	TcpClient struct {
		lock sync.RWMutex
		conn net.Conn
		dp   ziface.IDataPack

		option   Option
		revChan  chan int
		stopChan chan int
	}
	Option struct {
		ServerAddr string
		Retry      int
	}
)

var instance *TcpClient

func NewClient() *TcpClient {
	if instance == nil {
		conn, err := net.Dial("tcp", "127.0.0.1:8899")
		if err != nil {
			fmt.Println("client start err, exit!")
			return nil
		}
		instance = &TcpClient{
			revChan: make(chan int, 1),
			conn:    conn,
			dp:      zpack.Factory().NewPack(ziface.ZinxDataPack),
		}
	}
	fmt.Println("tcp client start.")
	return instance
}

func (cli *TcpClient) Start(ctx context.Context) error {
	//go cli.loopSend()
	cli.waitRecv()
	return nil
}
func (cli *TcpClient) Stop(ctx context.Context) error {
	//go cli.loopSend()
	err := cli.conn.Close()
	if err != nil {
		return err
	}
	return nil
}

func (cli *TcpClient) Send(data []byte) {
	msg, _ := cli.dp.Pack(zpack.NewMsgPackage(uint32(1002), data))
	_, err := cli.conn.Write(msg)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	cli.revChan <- -1
}

func (cli *TcpClient) recv() {
	headData := make([]byte, cli.dp.GetHeadLen())
	_, err := io.ReadFull(cli.conn, headData)
	if err != nil {
		fmt.Println(err.Error())
	}

	msgHead, err := cli.dp.Unpack(headData)
	if err != nil {
		fmt.Println(err.Error())
	}

	if msgHead.GetDataLen() == 0 {
		fmt.Println(err.Error())
	}
	msg := msgHead.(*zpack.Message)
	msg.Data = make([]byte, msg.GetDataLen())
	_, err = io.ReadFull(cli.conn, msg.Data)
	if err != nil {
		fmt.Println(err.Error())
	}

	recvData = msg.Data
	fmt.Printf("==> Client receive Msg: ID = %d, data = %s\n", msg.ID, msg.Data)
}

func (cli *TcpClient) waitRecv() {
	for {
		select {
		case <-cli.revChan:
			go cli.recv()
		}
	}
}

// 测试使用
func (cli *TcpClient) loopSend() {

	ticker := time.NewTicker(time.Duration(3) * time.Second)
	for {
		select {
		case <-ticker.C:
			cli.sendTest()
		case <-cli.stopChan:
			return
		}
	}
}

func (cli *TcpClient) sendTest() {
	msg, _ := cli.dp.Pack(zpack.NewMsgPackage(uint32(1002), hello))
	_, err := cli.conn.Write(msg)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	cli.revChan <- -1
}
