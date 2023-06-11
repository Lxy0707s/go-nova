package gen_model

import "github.com/go-nova/cmd/demo/internal/dao/model"

type UserMutationObject struct {
	Register *model.User `json:"register"`
}

type UserQueryObject struct {
	UserList []*model.User `json:"user_list"`
}
