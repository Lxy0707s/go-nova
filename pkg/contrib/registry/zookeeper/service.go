package zookeeper

import (
	"encoding/json"

	"github.com/go-nova/pkg/common/registration"
)

func marshal(si *registration.ServiceInstance) ([]byte, error) {
	return json.Marshal(si)
}

func unmarshal(data []byte) (si *registration.ServiceInstance, err error) {
	err = json.Unmarshal(data, &si)
	return
}
