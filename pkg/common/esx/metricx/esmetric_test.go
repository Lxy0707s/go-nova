package metricx

import (
	"fmt"
	"github.com/go-nova/pkg/common/esx"
	"os"
	"testing"
	"time"
)

func TestEsMetricClient_BatchInsertMetrics(t *testing.T) {
	esClient, err := esx.NewEsClient(esx.EsClientOpt{
		Host:     []string{"https://elasticsearch-picapica.bs58i.baishancdnx.com:443"},
		Username: "application_performance",
		Password: "123456",
	})
	if err != nil {
		t.Error(err)
		return
	}
	hostName, _ := os.Hostname()
	nowTime := time.Now()
	emCli := NewEsMetricClient(esClient)
	_, err = emCli.BatchInsertMetrics([]EsMetric{{
		Name:      "xds_test",
		Time:      nowTime.Unix(),
		StartTime: nowTime.Unix() * 1000,
		Value:     0,
		Fields: map[string]interface{}{
			"af": 12,
		},
		Tags: map[string]string{
			"tf": "111",
		},
		Step:     60,
		Endpoint: hostName,
	}})
	if err != nil {
		t.Error(err)
		return
	}
}

func TestNewEsMetricClient(t *testing.T) {
	st := time.Now()
	time.Sleep(time.Second * 2)
	fmt.Println(time.Since(st).Seconds())
}
