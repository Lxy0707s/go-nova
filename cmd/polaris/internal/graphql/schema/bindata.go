// Code generated for package schema by go-bindata DO NOT EDIT. (@generated)
// sources:
// ../../../module/demo/user_graphql/sdl/user.graphql
// ../sdl/base.graphql
// ../sdl/schema.graphql
// ../sdl/user.graphql
package schema

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

// Name return file name
func (fi bindataFileInfo) Name() string {
	return fi.name
}

// Size return file size
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}

// Mode return file mode
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}

// Mode return file modify time
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}

// IsDir return file whether a directory
func (fi bindataFileInfo) IsDir() bool {
	return fi.mode&os.ModeDir != 0
}

// Sys return file is sys mode
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var _ModuleDemoUser_graphqlSdlUserGraphql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x2a\xa9\x2c\x48\x55\x08\x2d\x4e\x2d\x52\xa8\xe6\xe5\x52\x50\x50\x50\x50\x56\x28\xcd\x4c\x81\x30\x4b\x33\x53\xac\x14\x3c\xf3\x4a\x60\x12\xcf\xa7\xac\x78\xd6\xb1\xfd\xe9\x84\x5e\xa8\x74\x71\x6a\x51\x5e\x62\x6e\xaa\x95\x42\x70\x49\x51\x66\x5e\xba\x22\x9a\xba\xf5\x6d\xcf\x17\x34\x42\xc4\x0a\x12\x8b\x8b\xcb\xf3\x8b\x52\x30\x94\x3e\x9d\xb3\xe1\xe9\xdc\x06\x08\x2f\x31\x25\xa5\x28\xb5\xb8\x18\x43\xcd\xcb\xa6\x75\xcf\xd7\x6d\x84\xf0\x52\x73\x13\x33\x73\x30\x54\xbc\x68\x9c\xf2\x7c\xf3\xee\xe7\x53\xb6\xbe\x58\x3f\x17\x6a\x61\x46\x7e\x1e\xa6\xc3\x9e\xcd\x58\xff\x74\xc2\xb2\xa7\x13\xd6\x3f\x9f\xb2\x02\x22\x96\x9c\x9f\x97\x92\x59\x92\x99\x9f\x57\x0c\xf6\x29\xc2\xc4\xe5\x93\x5e\x74\x6e\x82\x05\x44\x51\x7e\x4e\x6a\x3c\x34\x30\x10\xbe\x5c\xd7\xf0\x64\x77\x37\x84\x97\x92\x5a\x9c\x0c\xb3\x8d\x97\xab\x96\x97\x8b\x97\x2b\x33\xaf\xa0\xb4\x44\xc1\x2f\xb5\x1c\x39\x70\x71\x04\x19\x8e\xe0\xc1\x1e\x20\xd8\x82\x00\x9b\x77\x31\xbd\x86\xe4\x2e\x90\xa3\x3c\x5d\x10\x71\xfe\x6c\xfe\xd2\x17\xeb\x17\x79\xba\x40\xf8\x08\xaf\xd6\x02\x02\x00\x00\xff\xff\xde\xf1\x31\x33\x20\x02\x00\x00")

func ModuleDemoUser_graphqlSdlUserGraphqlBytes() ([]byte, error) {
	return bindataRead(
		_ModuleDemoUser_graphqlSdlUserGraphql,
		"../../../module/demo/user_graphql/sdl/user.graphql",
	)
}

func ModuleDemoUser_graphqlSdlUserGraphql() (*asset, error) {
	bytes, err := ModuleDemoUser_graphqlSdlUserGraphqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "../../../module/demo/user_graphql/sdl/user.graphql", size: 544, mode: os.FileMode(438), modTime: time.Unix(1708508942, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _SdlBaseGraphql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x74\x92\xc1\x4a\x2b\x31\x14\x86\xf7\x81\xbc\xc3\xb9\x74\x7b\x9f\xa0\xbb\x0b\x77\x33\x2e\x44\x6c\x77\xe2\x22\xb4\xa7\x43\xa0\x93\x89\x49\x66\xa1\xa5\xd0\x82\x48\xbb\x28\x2e\x6a\x29\x88\x82\xb3\x73\xd5\xba\xb0\x5d\x58\xaa\x2f\xe3\x4c\x9d\xb7\x90\xcc\x4c\xc7\x71\xd0\x5d\x92\xf3\xe5\x3f\xdf\x09\xe1\xc2\xa0\xea\xb0\x16\x82\xd3\x76\x8a\x75\x8f\x12\x00\x00\xde\xae\x83\x23\x0c\x25\x7d\x4a\x28\xe1\x42\x06\x06\x9c\xff\xff\x94\xab\x2b\xc4\x9f\x1c\xa9\x81\x64\x2e\x17\xcc\x20\x28\x3c\x0b\x50\x1b\x90\x4c\x31\x0f\x0d\xaa\x7d\xc0\x51\x46\x70\x5f\xec\x43\x6a\x10\x6d\xa7\xd1\x78\x12\x8f\x07\xd1\xdd\x63\x12\xae\xe2\xd9\x53\x56\x91\xcc\xc5\xc3\xc0\xcb\x7a\xfc\xad\xd0\xcb\x6b\x8b\xde\x87\xdf\xe8\x06\xbf\xc0\x02\xcf\x9d\xa2\xd1\x55\x12\xae\xde\xdf\xc2\x78\xb8\xa4\xc4\x9c\x4b\xb4\x12\xe8\x88\x8e\xdf\xb4\x9b\x2f\x8d\x14\xdc\xdd\x5e\xc6\x83\x4d\x59\xc3\xf8\x86\x75\xf3\xa7\x28\x2b\x58\x66\xb0\x29\x2b\xb4\x02\xa5\x50\x98\xbd\x73\x81\x4f\x66\x49\xb8\xfa\x58\xbc\xee\xb6\x0b\x1b\x5f\x96\x46\x65\x65\x7e\x48\xcf\x6c\xaa\xd1\x25\xf8\xf7\xf1\x8e\x51\x4b\x5f\x68\xac\x8c\x37\x9d\x44\x2f\x37\xbb\x87\x61\x1e\xe8\xb7\x2b\x6d\xd3\x7a\xbc\x1e\xa5\x41\xf6\xcc\xd3\x6e\x1d\x1a\x46\x71\xe1\x16\xed\xe2\xf9\x3a\x99\x3f\x53\xa2\x5b\xac\xcb\x14\x34\xb9\x87\x59\xe1\x40\xfb\xa2\x0e\x1e\x93\x27\x3a\xbd\x71\x5a\xfc\xad\x5e\xbf\xc0\x2d\x44\xc9\x67\x00\x00\x00\xff\xff\x0b\x0a\xef\x65\x76\x02\x00\x00")

func SdlBaseGraphqlBytes() ([]byte, error) {
	return bindataRead(
		_SdlBaseGraphql,
		"../sdl/base.graphql",
	)
}

func SdlBaseGraphql() (*asset, error) {
	bytes, err := SdlBaseGraphqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "../sdl/base.graphql", size: 630, mode: os.FileMode(438), modTime: time.Unix(1708480619, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _SdlSchemaGraphql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x2a\x4e\xce\x48\xcd\x4d\x54\xa8\xe6\xe5\x52\x50\x50\x50\x28\x2c\x4d\x2d\xaa\xb4\x52\x08\x04\x51\x10\x91\xdc\xd2\x92\xc4\x92\xcc\xfc\x3c\x2b\x05\x5f\x28\x8b\x97\xab\x96\x97\x4b\x59\x21\xbd\x28\xb1\x20\xa3\x30\xe7\x59\x67\xc3\xb3\x39\x9d\xcf\xe6\x2f\x7d\xb1\x7e\xd1\xb3\xbe\xa5\x4f\xfb\x17\xf3\x72\x95\x54\x16\xa4\x42\xcc\x80\x99\x5b\x5a\x9c\x5a\x64\xa5\x10\x5a\x9c\x5a\x04\x16\xf6\x4f\xca\x0a\xa9\x2c\x48\xc5\x66\xd2\x93\xfd\xeb\x9e\x4d\xd9\x89\x62\x12\xcc\x62\x4c\xc3\x60\x32\xc8\xe6\xf1\x72\x01\x02\x00\x00\xff\xff\xf9\x65\x50\x58\xd3\x00\x00\x00")

func SdlSchemaGraphqlBytes() ([]byte, error) {
	return bindataRead(
		_SdlSchemaGraphql,
		"../sdl/schema.graphql",
	)
}

func SdlSchemaGraphql() (*asset, error) {
	bytes, err := SdlSchemaGraphqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "../sdl/schema.graphql", size: 211, mode: os.FileMode(438), modTime: time.Unix(1708500479, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _SdlUserGraphql = []byte("\x1f\x8b\x08\x00\x00\x00\x00\x00\x00\xff\x2a\xa9\x2c\x48\x55\x08\x2d\x4e\x2d\x0a\x2c\x4d\x2d\xaa\xf4\x4f\xca\x0a\xa9\x2c\x48\xad\xe6\xe5\x52\x50\x50\x50\x28\x2d\x4e\x2d\xf2\xc9\x2c\x2e\xd1\xc8\x4c\xb1\x02\xab\xf1\x74\xd1\xb4\x52\x88\x06\xb1\x62\x79\xb9\x6a\x79\xb9\x78\xb9\xe0\xda\x7d\x4b\x4b\x12\x4b\x32\xf3\xf3\x50\x4d\x48\x4c\x49\x01\x49\x5a\x29\x04\x97\x14\x65\xe6\xa5\x83\x35\x01\x02\x00\x00\xff\xff\xfb\x20\xb7\x46\x72\x00\x00\x00")

func SdlUserGraphqlBytes() ([]byte, error) {
	return bindataRead(
		_SdlUserGraphql,
		"../sdl/user.graphql",
	)
}

func SdlUserGraphql() (*asset, error) {
	bytes, err := SdlUserGraphqlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "../sdl/user.graphql", size: 114, mode: os.FileMode(438), modTime: time.Unix(1708502383, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"../../../module/demo/user_graphql/sdl/user.graphql": ModuleDemoUser_graphqlSdlUserGraphql,
	"../sdl/base.graphql":                                SdlBaseGraphql,
	"../sdl/schema.graphql":                              SdlSchemaGraphql,
	"../sdl/user.graphql":                                SdlUserGraphql,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//
//	data/
//	  foo.txt
//	  img/
//	    a.png
//	    b.png
//
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}

var _bintree = &bintree{nil, map[string]*bintree{
	"..": &bintree{nil, map[string]*bintree{
		"..": &bintree{nil, map[string]*bintree{
			"..": &bintree{nil, map[string]*bintree{
				"module": &bintree{nil, map[string]*bintree{
					"demo": &bintree{nil, map[string]*bintree{
						"user_graphql": &bintree{nil, map[string]*bintree{
							"sdl": &bintree{nil, map[string]*bintree{
								"user.graphql": &bintree{ModuleDemoUser_graphqlSdlUserGraphql, map[string]*bintree{}},
							}},
						}},
					}},
				}},
			}},
		}},
		"sdl": &bintree{nil, map[string]*bintree{
			"base.graphql":   &bintree{SdlBaseGraphql, map[string]*bintree{}},
			"schema.graphql": &bintree{SdlSchemaGraphql, map[string]*bintree{}},
			"user.graphql":   &bintree{SdlUserGraphql, map[string]*bintree{}},
		}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}
