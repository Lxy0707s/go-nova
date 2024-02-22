package e

type CodeError struct {
	code int
	desc string
	data interface{}
}

func (err *CodeError) Error() string {
	return err.desc
}

func (err *CodeError) Code() int {
	return err.code
}

func (err *CodeError) Desc() string {
	return err.desc
}

func (err *CodeError) Data() interface{} {
	return err.data
}

func NewCodeError(code int, desc string) *CodeError {
	return &CodeError{
		code: code,
		desc: desc,
	}
}

func NewError(code int, desc string, data interface{}) *CodeError {
	return &CodeError{
		code: code,
		desc: desc,
		data: data,
	}
}

func IsCodeError(err error) bool {
	switch err.(type) {
	case *CodeError:
		return true
	}
	return false
}

func FromError(err error) (codeErr *CodeError, ok bool) {
	if se, ok := err.(*CodeError); ok {
		return se, true
	}
	return nil, false
}

func ToCodeError(err error) *CodeError {
	if IsCodeError(err) {
		return err.(*CodeError)
	}
	return NewCodeError(500, "服务器内部错误")
}
