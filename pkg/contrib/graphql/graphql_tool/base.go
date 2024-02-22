package graphql_tool

import (
	"github.com/graph-gophers/graphql-go"
	"strconv"
)

type IdArgs struct {
	Id int32 `json:"id"`
}

//func (p PageArgs) PageNum() *int {
//	return p.P.PageNum
//}
//
//func (p PageArgs) PageSize() *int {
//	return p.P.PageSize
//}

func ItoGID(i int) graphql.ID {
	return graphql.ID(strconv.Itoa(i))
}

func I32toGID(i int32) graphql.ID {
	return ItoGID(int(i))
}

func I64toGID(i int64) graphql.ID {
	// 64 进制数转字符串
	return graphql.ID(strconv.FormatInt(i, 64))
}
