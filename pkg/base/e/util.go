package e

func Glean(fns ...func() error) error {
	for _, fn := range fns {
		if err := fn(); err != nil {
			return err
		}
	}
	return nil
}

func NewDefaultError(desc string) *CodeError {
	return NewCodeError(10001, desc)
}

func NewServerError() *CodeError {
	return NewCodeError(500, "服务器出错")
}
