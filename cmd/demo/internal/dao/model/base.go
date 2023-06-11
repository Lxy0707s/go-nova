package model

import "github.com/go-nova/cmd/demo/internal/dao/gen_model"

type UserMutationObject struct {
	Register *gen_model.User `json:"register"`
}

type UserQueryObject struct {
	UserList []*gen_model.User `json:"user_list"`
}
