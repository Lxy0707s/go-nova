package graphql_tool

import "github.com/go-nova/pkg/base/e"

type Response struct {
	Code int32
	Msg  string
}

type ResponseType struct {
	*Response
}

func Out(code int, freeMsg ...string) *ResponseType {
	resp := ResponseType{Response: &Response{
		Code: int32(code),
	}}
	if len(freeMsg) > 0 && freeMsg[0] != "" {
		resp.Response.Msg = freeMsg[0]
	} else {
		resp.Response.Msg = e.GetMsg(code)
	}
	return &resp
}

func (resp ResponseType) Code() *int32 {
	return &resp.Response.Code
}

func (resp ResponseType) Msg() *string {
	return &resp.Response.Msg
}
