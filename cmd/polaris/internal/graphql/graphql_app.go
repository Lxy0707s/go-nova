package graphql

import (
	"github.com/go-nova/cmd/polaris/module/demo/user_graphql/user_mutation"
	"github.com/go-nova/cmd/polaris/module/demo/user_graphql/user_query"
)

type Resolver struct{}

func RegisterResolver() *Resolver {
	//注册
	return &Resolver{}
}

type AppObjectType struct {
	*user_query.QueryUserResolver
	*user_mutation.MutationUserResolver
}

func (r *Resolver) User() (*AppObjectType, error) {
	return &AppObjectType{}, nil
}
