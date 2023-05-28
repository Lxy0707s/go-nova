module github.com/go-nova/pkg/third_party/contrib/opensergo/v2

go 1.20

require (
	github.com/go-nova v1.0.0
	github.com/opensergo/opensergo-go v0.0.0-20220331070310-e5b01fee4d1c
	golang.org/x/net v0.9.0
	google.golang.org/genproto v0.0.0
	google.golang.org/grpc v1.55.0
	google.golang.org/protobuf v1.30.0
)

require (
	github.com/go-playground/form/v4 v4.2.0 // indirect
	github.com/golang/protobuf v1.5.3 // indirect
	github.com/google/uuid v1.3.0 // indirect
	golang.org/x/sync v0.0.0-20220513210516-0976fa681c29 // indirect
	golang.org/x/sys v0.7.0 // indirect
	golang.org/x/text v0.9.0 // indirect
	gopkg.in/yaml.v2 v2.3.0 // indirect
)

replace google.golang.org/genproto => github.com/google/go-genproto v0.0.0-20181219182458-5a97ab628bfb

replace github.com/go-nova => ../../../
