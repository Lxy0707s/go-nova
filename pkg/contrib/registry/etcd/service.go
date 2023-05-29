package etcd

import (
	"encoding/json"

	"github.com/go-nova/pkg/common/registration"
)

func marshal(si *registration.ServiceInstance) (string, error) {
	data, err := json.Marshal(si)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func unmarshal(data []byte) (si *registration.ServiceInstance, err error) {
	err = json.Unmarshal(data, &si)
	return
}
