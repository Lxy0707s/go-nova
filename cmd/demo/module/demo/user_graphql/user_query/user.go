package user_query

import (
	"context"
	"github.com/go-nova/cmd/demo/internal/dao"
	"github.com/go-nova/cmd/demo/internal/dao/model"
	"github.com/go-nova/cmd/demo/module/demo/query"
)

type QueryResolver struct{}

// UserList is the resolver for the books field.
func (r *QueryResolver) UserList(ctx context.Context, id *model.UserID) ([]*model.User, error) {
	// 连接数据库
	db := dao.NovaDao()
	query.SetDefault(db)
	u := query.Use(db).User
	var users []*model.User

	// query the first user
	query.Q.User.Where(u.ID.Eq(id.ID)).Scan(&users)

	return users, nil
}
