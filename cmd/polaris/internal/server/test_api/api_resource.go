package test_api

import (
	log2 "github.com/go-nova/pkg/core/log"
)

type ApiRes struct {
}

func (api ApiRes) ApiName() string {
	return "test"
}

func (api ApiRes) Refresh(data []byte) {
	log2.Infow("fetch_data", string(data))
}
