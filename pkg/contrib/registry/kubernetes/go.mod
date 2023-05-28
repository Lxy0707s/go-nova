module github.com/go-nova/pkg/third_party/contrib/registry/kubernetes/v2

go 1.16

require (
	github.com/go-nova v1.0.0
	github.com/json-iterator/go v1.1.12
	k8s.io/api v0.24.3
	k8s.io/apimachinery v0.24.3
	k8s.io/client-go v0.24.3
)

replace github.com/go-nova => ../../../../
