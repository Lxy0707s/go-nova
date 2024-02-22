package test_api

import "fmt"

type ApiRes struct {
}

func (api ApiRes) ApiName() string {
	return "test"
}

func (api ApiRes) Refresh(data []byte) {
	fmt.Println("收到测试结果: ", string(data))
}
