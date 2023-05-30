package kgin

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	thttp "github.com/go-nova/pkg/core/transport/http"
	"github.com/go-nova/pkg/utils/errors"
)

const (
	baseContentType = "application"
)

type errorRender struct {
	body        []byte
	contentType string
}

// Render (JSON) writes data with custom ContentType.
func (er *errorRender) Render(w http.ResponseWriter) error {
	_, err := w.Write(er.body)
	return err
}

// WriteContentType (JSON) writes JSON ContentType.
func (er *errorRender) WriteContentType(w http.ResponseWriter) {
	w.Header().Set("Content-Type", er.contentType)

}

// Error encodes the object to the HTTP response.
func Error(c *gin.Context, err error) {
	if err == nil {
		c.Status(http.StatusOK)
		return
	}
	codec, _ := thttp.CodecForRequest(c.Request, "Accept")
	se := errors.FromError(err)
	body, err := codec.Marshal(se)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	contentType := codec.Name()
	code := int(se.Code)
	c.Render(code, &errorRender{body: body, contentType: contentType})
	return
}

// ContentType returns the content-type with base prefix.
func ContentType(subtype string) string {
	return strings.Join([]string{baseContentType, subtype}, "/")
}
