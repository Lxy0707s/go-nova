package tracing

import (
	"context"

	apps "github.com/go-nova/pkg/common/app"
	"reflect"
	"testing"

	"github.com/go-nova/pkg/utils/metadata"

	"go.opentelemetry.io/otel/propagation"
)

func TestMetadata_Inject(t *testing.T) {
	type args struct {
		appName string
		carrier propagation.TextMapCarrier
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "https://go-nova.dev",
			args: args{"https://go-nova.dev", propagation.HeaderCarrier{}},
			want: "https://go-nova.dev",
		},
		{
			name: "https://github.com/go-nova/kratos",
			args: args{"https://github.com/go-nova/kratos", propagation.HeaderCarrier{"mode": []string{"test"}}},
			want: "https://github.com/go-nova/kratos",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			a := apps.New(apps.Name(tt.args.appName))
			ctx := apps.NewContext(context.Background(), a)
			m := new(Metadata)
			m.Inject(ctx, tt.args.carrier)
			if res := tt.args.carrier.Get(serviceHeader); tt.want != res {
				t.Errorf("Get(serviceHeader) :%s want: %s", res, tt.want)
			}
		})
	}
}

func TestMetadata_Extract(t *testing.T) {
	type args struct {
		parent  context.Context
		carrier propagation.TextMapCarrier
	}
	tests := []struct {
		name  string
		args  args
		want  string
		crash bool
	}{
		{
			name: "https://go-nova.dev",
			args: args{
				parent:  context.Background(),
				carrier: propagation.HeaderCarrier{"X-Md-Service-Name": []string{"https://go-nova.dev"}},
			},
			want: "https://go-nova.dev",
		},
		{
			name: "https://github.com/go-nova/kratos",
			args: args{
				parent:  metadata.NewServerContext(context.Background(), metadata.Metadata{}),
				carrier: propagation.HeaderCarrier{"X-Md-Service-Name": []string{"https://github.com/go-nova/kratos"}},
			},
			want: "https://github.com/go-nova/kratos",
		},
		{
			name: "https://github.com/go-nova/kratos",
			args: args{
				parent:  metadata.NewServerContext(context.Background(), metadata.Metadata{}),
				carrier: propagation.HeaderCarrier{"X-Md-Service-Name": nil},
			},
			crash: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := Metadata{}
			ctx := b.Extract(tt.args.parent, tt.args.carrier)
			md, ok := metadata.FromServerContext(ctx)
			if !ok {
				if tt.crash {
					return
				}
				t.Errorf("expect %v, got %v", true, ok)
			}
			if !reflect.DeepEqual(md.Get(serviceHeader), tt.want) {
				t.Errorf("expect %v, got %v", tt.want, md.Get(serviceHeader))
			}
		})
	}
}

func TestFields(t *testing.T) {
	b := Metadata{}
	if !reflect.DeepEqual(b.Fields(), []string{"x-md-service-name"}) {
		t.Errorf("expect %v, got %v", []string{"x-md-service-name"}, b.Fields())
	}
}
