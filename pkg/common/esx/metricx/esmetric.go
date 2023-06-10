package metricx

import (
	"github.com/go-nova/pkg/common/esx"
	"time"
)

type EsMetricClient struct {
	indexPrefix    string
	batchInsertCnt int
	esClient       *esx.EsClient
}

func NewEsMetricClient(esClient *esx.EsClient) *EsMetricClient {
	return &EsMetricClient{
		indexPrefix:    "ap-perseus-",
		batchInsertCnt: 1000,
		esClient:       esClient,
	}
}

func (e *EsMetricClient) InsertMetric(metric EsMetric) error {
	nowDate := time.Now().Format("2006-01-02")
	idx := e.indexPrefix + nowDate
	return e.esClient.Insert(idx, metric)
}

func (e *EsMetricClient) BatchInsertMetrics(esMetrics []EsMetric, batchSizes ...int) (int, error) {
	var batchSize int
	if len(batchSizes) > 0 {
		batchSize = batchSizes[0]
	} else {
		batchSize = e.batchInsertCnt
	}
	nowDate := time.Now().Format("2006-01-02")
	idx := e.indexPrefix + nowDate
	metrics := make([]interface{}, 0)
	for _, m := range esMetrics {
		metrics = append(metrics, m)
	}
	if len(metrics) <= batchSize {
		return e.esClient.BatchInsert(idx, metrics)
	} else {
		for len(metrics) > batchSize {
			newMetrics := metrics[:batchSize]
			if cnt, err := e.esClient.BatchInsert(idx, newMetrics); err != nil {
				return cnt, err
			}
			metrics = metrics[batchSize:]
		}
		return e.esClient.BatchInsert(idx, metrics)
	}
}
