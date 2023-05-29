package hello

import (
	khttp "github.com/go-nova/pkg/utils/transport/http"
)

type Test struct {
	Name string
}

func Hello2(ctx khttp.Context) error {
	u := new(Test)
	u.Name = "test"
	return ctx.Result(200, u)
}
