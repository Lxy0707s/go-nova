module github.com/go-nova/pkg/third_party/contrib/registry/etcd/v2

go 1.16

require (
	github.com/go-nova v1.0.0
	go.etcd.io/etcd/client/v3 v3.5.8
	google.golang.org/grpc v1.50.1
)

replace github.com/go-nova => ../../../../
