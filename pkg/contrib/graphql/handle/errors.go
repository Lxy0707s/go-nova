package handle

import (
	"errors"
	graphql "github.com/graph-gophers/graphql-go/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	//check data loader key,and service returns type
	ErrLoaderWrongType  = errors.New("LOADER_WRONG_TYPE")
	ErrPermissionDenied = errors.New("PERMISSION_DENIED")
	ErrUnauthorized     = errors.New("UNAUTHORIZED")
	ErrGRPCUnavailable  = errors.New("GRPCUnavailable")
	ErrDeadlineExceeded = errors.New("DeadlineExceeded")
)

func Expand(errs []*graphql.QueryError) []*graphql.QueryError {
	expanded := make([]*graphql.QueryError, 0, len(errs))

	for _, err := range errs {
		switch t := err.ResolverError.(type) {
		case interface{ GRPCStatus() *status.Status }: //for grpc
			switch t.GRPCStatus().Code() {
			case codes.DeadlineExceeded: //timeout
				err.Message = ErrMessage.GetErrorDescription(ErrDeadlineExceeded).Message
			case codes.Unavailable:
				err.Message = ErrMessage.GetErrorDescription(ErrGRPCUnavailable).Message
			default:
			}
			expanded = append(expanded, err)
		default:
			if ErrMessage != nil && err.ResolverError != nil {
				err.Message = ErrMessage.GetErrorDescription(err.ResolverError).Message
			}
			expanded = append(expanded, err)
		}
	}

	return expanded
}
