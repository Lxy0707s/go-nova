package option

import (
	"context"
	"crypto/tls"
	"errors"
	"github.com/go-nova/pkg/core/log"
	"github.com/gorilla/mux"
	"net"
	"net/http"
	"time"
)

type Server struct {
	*http.Server

	lis     net.Listener
	tlsConf *tls.Config
	router  *mux.Router

	network string
	address string

	strictSlash bool
	timeout     time.Duration

	err error
}

func (s *Server) Start(ctx context.Context) error {
	if s.err != nil {
		return s.err
	}
	s.BaseContext = func(net.Listener) context.Context {
		return ctx
	}
	log.Infof("server listening on: %s", s.lis.Addr().String())
	var err error
	if s.tlsConf != nil {
		err = s.ServeTLS(s.lis, "", "")
	} else {
		err = s.Serve(s.lis)
	}
	if !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	log.Info("[graphql] server stopping")
	return s.Shutdown(ctx)
}
