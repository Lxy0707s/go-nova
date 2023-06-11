package model

type UserMutationObject struct {
	Register []*User `json:"register"`
}

type UserQueryObject struct {
	UserList []*User `json:"userList"`
}
