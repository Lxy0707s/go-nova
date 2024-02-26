package user_mutation

import (
	"context"
	"github.com/go-nova/cmd/polaris/internal/dao"
	"github.com/go-nova/cmd/polaris/internal/dao/model"
	"github.com/go-nova/cmd/polaris/module/demo/dbutils"
	dao2 "github.com/go-nova/pkg/base/dao"
	"github.com/go-nova/pkg/core/log"
	"time"
)

type MutationUserResolver struct{}

// AddUser is the resolver for the user field.
func (r *MutationUserResolver) AddUser(ctx context.Context) (*string, error) {
	// 连接数据库
	db := dao.NovaDao()
	dbutils.SetDefault(db)
	var users []*model.SysUser
	users = append(users, &model.SysUser{
		PUserName:    "add_user",
		PPassword:    "add_pwd",
		PAddress:     "test",
		PEmail:       "test",
		PPhone:       "test",
		PConditions:  1,
		PDescription: "test",

		Model: dao2.Model{
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	})
	log.Infow("users", users)
	// query the first user
	err := dbutils.Q.SysUser.Create(users...)
	if err != nil {
		s := err.Error()
		return &s, err
	}
	res := "add user success"
	return &res, nil
}
