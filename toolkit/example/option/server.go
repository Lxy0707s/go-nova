package option

import (
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/gorilla/mux"
	"net"
	"net/http"
	"time"
)

func NewServer(opts ...ServerOption) *Server {
	srv := &Server{
		network:     "tcp",
		address:     ":0",
		timeout:     1 * time.Second,
		strictSlash: true,
	}

	srv.init(opts...)

	srv.err = srv.listenAndEndpoint()

	return srv
}

func (s *Server) Name() string {
	return "graphql"
}

func (s *Server) init(opts ...ServerOption) {
	for _, o := range opts {
		o(s)
	}

	s.router = mux.NewRouter().StrictSlash(s.strictSlash)
	s.router.NotFoundHandler = http.DefaultServeMux
	s.router.MethodNotAllowedHandler = http.DefaultServeMux
	//srv.router.Use(srv.filter())

	s.Server = &http.Server{
		TLSConfig: s.tlsConf,
		Handler:   s.router,
	}
}

func (s *Server) Handle(path string, es graphql.ExecutableSchema) {
	s.router.Handle(path, handler.NewDefaultServer(es))
}

func (s *Server) listenAndEndpoint() error {
	if s.lis == nil {
		lis, err := net.Listen(s.network, s.address)
		if err != nil {
			return err
		}
		s.lis = lis
	}

	return nil
}
