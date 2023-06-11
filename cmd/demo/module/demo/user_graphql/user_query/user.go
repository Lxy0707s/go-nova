package user_query

import (
	"context"
	"github.com/go-nova/cmd/demo/internal/dao/model"
)

type QueryResolver struct{}

// UserList is the resolver for the books field.
func (r *QueryResolver) UserList(ctx context.Context) ([]*model.User, error) {
	user := &model.User{
		Name:    "xxxx",
		ID:      1243240,
		Address: "贵阳-观山湖",
		Email:   "222534643@qq.com",
	}
	var users []*model.User
	users = append(users, user)
	return users, nil
}
