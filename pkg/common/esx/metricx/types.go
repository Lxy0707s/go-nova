package metricx

type EsMetric struct {
	Name      string                 `json:"name"`
	Time      int64                  `json:"time"`
	StartTime int64                  `json:"start_time"`
	Value     float64                `json:"value"`
	Fields    map[string]interface{} `json:"fields,omitempty"`
	Tags      map[string]string      `json:"tags,omitempty"`
	Step      int64                  `json:"step"`
	Endpoint  string                 `json:"endpoint"`
}

type InfluxdbMetric struct {
	Name     string                 `json:"name"`
	Time     int64                  `json:"time"`
	Value    float64                `json:"value"`
	Tags     map[string]string      `json:"tags,omitempty"`
	Fields   map[string]interface{} `json:"fields,omitempty"`
	Step     int64                  `json:"step"`
	Endpoint string                 `json:"endpoint"`
}
