package sync_client

import (
	"context"
	"fmt"
	"github.com/go-nova/cmd/demo/internal/server/test_api"
	"github.com/go-nova/pkg/common/datas/base_struct"
	"github.com/go-nova/pkg/core/transport/http_client"
	"github.com/go-nova/pkg/infrastructure/hash"
	"sync"
)

var instance *SyncServer

type (
	SyncServer struct {
		lock         sync.RWMutex
		syncInstance *http_client.Manager
		apiDataHash  map[string]string
		//profCount         map[string]*prof.CountBase
		getResourceData map[string]RefreshResourceData
		apiResource     test_api.ApiRes
		options         Options

		isRunning  bool
		statusLock sync.RWMutex
		stopSign   chan int
	}
	Options []base_struct.APIs

	RefreshResourceData func(data []byte)
)

func NewServer(apis Options) *SyncServer {
	if instance == nil {
		instance = &SyncServer{
			options: apis,
		}
	}
	options := make([]*http_client.SingleOption, 0)
	body := []byte("[]")
	for _, api := range apis {
		if api.Body != "[]" {
			if len(api.Token) != 0 {
				body = []byte(fmt.Sprintf(api.Body, api.Token))
			} else {
				body = []byte(fmt.Sprintf(api.Body, "opt.ResourceToken"))
			}
		}

		if api.Name == "" {
			body = []byte("")
		}
		singleOpt := &http_client.SingleOption{
			Name:     api.Name,
			Address:  api.Address,
			AppID:    api.AppID,
			Secret:   api.Secret,
			Body:     body,
			Token:    api.Token,
			Type:     api.Type,
			Interval: api.Interval,
			UserId:   api.UserId,
			Timeout:  api.Timeout,
			Update:   instance.Update,
		}
		options = append(options, singleOpt)
	}
	instance.syncInstance = http_client.NewManager(options)
	return instance
}

func (sync *SyncServer) Start(ctx context.Context) error {
	fmt.Println("api sync server start now.")
	instance.statusLock.Lock()
	defer instance.statusLock.Unlock()
	if !instance.isRunning {
		instance.isRunning = true
		instance.stopSign = make(chan int, 1)
		instance.serverBind()
		_ = instance.syncInstance.Start()
		return nil
	}
	//s.log.Info("send server already started")
	return nil
}

func (sync *SyncServer) Stop(ctx context.Context) error {
	return nil
}

func (sync *SyncServer) serverBind() {
	if instance.apiDataHash == nil {
		instance.apiDataHash = make(map[string]string)
	}
	// 注册配置文件中url与对应资源的绑定关系
	instance.getResourceData = map[string]RefreshResourceData{
		instance.apiResource.ApiName(): instance.apiResource.Refresh,
	}
}

// Update be called when synchronizer return message
func (sync *SyncServer) Update(data []byte, apiName string) {
	if !instance.refreshHashValue(data, apiName) {
		//s.log.Info("resource data not fresh:", "apiName: ", apiName)
		return
	}
	//资源接口数据处理
	if _, ok := instance.getResourceData[apiName]; ok {
		//s.log.Info("deal resource data:", "apiName: ", apiName)
		instance.getResourceData[apiName](data)
	}
	//s.log.Info("update resource finished.")
}

func (sync *SyncServer) refreshHashValue(data []byte, apiName string) bool {
	newHashValue := hash.MD5(data)
	if newHashValue == instance.apiDataHash[apiName] {
		//s.log.Warn("resource : api data keep the same", "api name", apiName)
		return false
	}
	//s.log.Info("resource : api data hash change", "api name", apiName, "old hash", instance.apiDataHashValues[apiName], "new hash", newHashValue)
	instance.apiDataHash[apiName] = newHashValue
	return true
}
