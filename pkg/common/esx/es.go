package esx

import (
	"context"
	"encoding/json"
	"errors"
	"math/rand"

	"github.com/olivere/elastic"
)

type EsClientOpt struct {
	Host     []string
	Username string
	Password string
}

type EsClient struct {
	opt      *EsClientOpt
	esClient *elastic.Client
}

func buildCliOpt(opt EsClientOpt) *[]elastic.ClientOptionFunc {
	opts := make([]elastic.ClientOptionFunc, 0)
	opts = append(opts, elastic.SetURL(opt.Host...))
	if opt.Username != "" {
		opts = append(opts, elastic.SetBasicAuth(opt.Username, opt.Password))
	}
	opts = append(opts, elastic.SetSniff(false))
	opts = append(opts, elastic.SetHealthcheck(false))
	return &opts
}

func NewEsClient(opt EsClientOpt) (*EsClient, error) {
	optFuncs := buildCliOpt(opt)
	esClient, err := elastic.NewClient(*optFuncs...)
	if err != nil {
		return nil, err
	}
	esMCli := &EsClient{
		opt:      &opt,
		esClient: esClient,
	}
	_, err = esMCli.PingEsNode()
	if err != nil {
		return nil, err
	}
	return esMCli, nil
}

// PingEsNodeWithInfo 连接测试并返回相关信息
func (e *EsClient) PingEsNodeWithInfo() (string, *elastic.PingResult, error) {
	idx := rand.Intn(len(e.opt.Host))
	info, _, err := e.esClient.Ping(e.opt.Host[idx]).Do(context.Background())
	if err != nil {
		return e.opt.Host[idx], nil, err
	}
	return e.opt.Host[idx], info, nil
}

// PingEsNode 连接测试
func (e *EsClient) PingEsNode() (string, error) {
	host, _, err := e.PingEsNodeWithInfo()
	return host, err
}

// IndexExists 校验 index 是否存在
func (e *EsClient) IndexExists(index ...string) (bool, error) {
	exists, err := e.esClient.IndexExists(index...).Do(context.Background())
	if err != nil {
		return false, err
	}
	return exists, nil
}

// CreateIndex 创建 index
func (e *EsClient) CreateIndex(index, mapping string) (bool, error) {
	result, err := e.esClient.CreateIndex(index).BodyString(mapping).Do(context.Background())
	if err != nil {
		return false, err
	}
	return result.Acknowledged, nil
}

// DelIndex 删除 index
func (e *EsClient) DelIndex(index ...string) (bool, error) {
	response, err := e.esClient.DeleteIndex(index...).Do(context.Background())
	if err != nil {
		return false, err
	}
	return response.Acknowledged, nil
}

// Insert 插入文档
func (e *EsClient) Insert(index string, data interface{}) error {
	_, err := e.esClient.Index().Index(index).Type("_doc").BodyJson(data).Do(context.Background())
	if err != nil {
		return err
	}
	return nil
}

// BatchInsert 批量插入
func (e *EsClient) BatchInsert(index string, datas []interface{}) (int, error) {
	bulkRequest := e.esClient.Bulk()
	for _, data := range datas {
		dataBytes, err := json.Marshal(data)
		if err != nil {
			continue
		}
		doc := elastic.NewBulkIndexRequest().Index(index).Type("_doc").UseEasyJSON(true).Doc(string(dataBytes))
		bulkRequest = bulkRequest.Add(doc)
	}
	response, err := bulkRequest.Do(context.TODO())
	if err != nil {
		return 0, err
	}
	failed := response.Failed()
	iter := len(failed)
	if iter > 0 {
		return iter, errors.New(failed[0].Error.Reason)
	}
	return len(datas), nil
}

// GetDoc 获取指定 Id 的文档
func (e *EsClient) GetDoc(index, id string) (*elastic.GetResult, error) {
	temp := e.esClient.Get().Index(index).Id(id)
	return temp.Do(context.Background())
}

// TermQuery 查询
func (e *EsClient) TermQuery(index, type_, fieldName, fieldValue string) (*elastic.SearchResult, error) {
	query := elastic.NewTermQuery(fieldName, fieldValue)
	searchResult, err := e.esClient.Search().
		Index(index).Type(type_).
		Query(query).
		From(0).Size(10).
		Pretty(true).
		Do(context.Background())
	if err != nil {
		return nil, err
	}
	return searchResult, nil
}

func (e *EsClient) Search(index, type_ string) (*elastic.SearchResult, error) {
	boolQuery := elastic.NewBoolQuery()
	boolQuery.Must(elastic.NewMatchQuery("user", "Jame10"))
	boolQuery.Filter(elastic.NewRangeQuery("age").Gt("30"))
	searchResult, err := e.esClient.Search(index).
		Type(type_).Query(boolQuery).Pretty(true).Do(context.Background())
	if err != nil {
		return nil, err
	}
	return searchResult, err
}
