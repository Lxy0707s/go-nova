// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type NewUser struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Email   string `json:"email"`
}

type User struct {
	ID      int64  `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	Email   string `json:"email"`
}

type UserID struct {
	ID int64 `json:"id"`
}

func (User) TableName() string {
	return "nova.user"
}
