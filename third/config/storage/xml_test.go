package storage_test

import (
	"fmt"
	"github.com/tomwright/dasel/storage"
	"reflect"
	"testing"
)

var xmlBytes = []byte(`<user>
  <name>Tom</name>
</user>
`)
var xmlMap = map[string]interface{}{
	"user": map[string]interface{}{
		"name": "Tom",
	},
}

func TestXMLParser_FromBytes2(t *testing.T) {
	got, err := (&storage.XMLParser{}).FromBytes([]byte(`<data>
	<names>
		<name>Tom</name>
		<name>Jim</name>
	</names>
</data>`))
	if err != nil {
		t.Errorf("unexpected error: %s", err)
		return
	}

	fmt.Println(got)
}

func TestXMLParser_FromBytes(t *testing.T) {
	got, err := (&storage.XMLParser{}).FromBytes(xmlBytes)
	if err != nil {
		t.Errorf("unexpected error: %s", err)
		return
	}
	if !reflect.DeepEqual(xmlMap, got) {
		t.Errorf("expected %v, got %v", xmlMap, got)
	}
}

func TestXMLParser_FromBytes_Error(t *testing.T) {
	_, err := (&storage.XMLParser{}).FromBytes(nil)
	if err == nil {
		t.Errorf("expected error but got none")
		return
	}
	_, err = (&storage.XMLParser{}).FromBytes(yamlBytes)
	if err == nil {
		t.Errorf("expected error but got none")
		return
	}
}

func TestXMLParser_ToBytes(t *testing.T) {
	got, err := (&storage.XMLParser{}).ToBytes(xmlMap)
	if err != nil {
		t.Errorf("unexpected error: %s", err)
		return
	}
	if !reflect.DeepEqual(xmlBytes, got) {
		t.Errorf("expected %v, got %v", string(xmlBytes), string(got))
	}
}
