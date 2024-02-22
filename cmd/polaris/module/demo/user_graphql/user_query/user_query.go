package user_query

import (
	"context"
	"github.com/go-nova/cmd/polaris/internal/dao"
	"github.com/go-nova/cmd/polaris/internal/dao/model"
	"github.com/go-nova/cmd/polaris/module/demo/dbutils"
)

type QueryUserResolver struct{}

// UserList is the resolver for the user field.
func (r *QueryUserResolver) UserList(ctx context.Context, id model.UserID) (*[]*model.SysUser, error) {
	// 连接数据库
	db := dao.NovaDao()
	dbutils.SetDefault(db)
	u := dbutils.Use(db).SysUser
	var users []*model.SysUser

	// query the first user
	dbutils.Q.SysUser.Where(u.PUid.Eq(int64(id.ID.Id))).Scan(&users)

	return &users, nil
}
