module github.com/go-nova/pkg/third_party/contrib/log/aliyun/v2

go 1.16

require (
	github.com/aliyun/aliyun-log-go-sdk v0.1.44
	google.golang.org/protobuf v1.30.0
	github.com/go-nova v1.0.0
)

replace (
    github.com/go-nova => ../../../../../
	github.com/gogo/protobuf v1.3.1 => github.com/gogo/protobuf v1.3.2
)
