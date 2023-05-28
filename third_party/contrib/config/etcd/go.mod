module github.com/go-kratos/kratos/contrib/config/etcd/v2

go 1.16

require (
	github.com/go-nova v1.0.0
	go.etcd.io/etcd/client/v3 v3.5.8
	google.golang.org/grpc v1.54.0
)

replace github.com/go-nova => ../../../
