package dasel_test

import (
	"fmt"
	"github.com/go-nova/third_party/config/storage"
	"github.com/tomwright/dasel"
	"reflect"
	"testing"
)

var (
	tom = map[string]interface{}{
		"name": "Tom",
		"age":  28,
	}
	amelia = map[string]interface{}{
		"name": "Amelia",
		"age":  26,
	}
	people = []map[string]interface{}{tom, amelia}
	mapC   = map[string]interface{}{
		"thing": "1",
	}
	mapB = map[string]interface{}{
		"c":      mapC,
		"people": people,
	}
	mapA = map[string]interface{}{
		"b": mapB,
	}
	mapRoot = map[string]interface{}{
		"a": mapA,
	}
)

func TestParseSelector(t *testing.T) {
	t.Run("NonIntIndex", func(t *testing.T) {
		_, err := dasel.ParseSelector(".[a]")
		exp := &dasel.InvalidIndexErr{Index: "a"}
		if err == nil || err.Error() != exp.Error() {
			t.Errorf("expected error %v, got %v", exp, err)
		}
	})
	t.Run("InvalidDynamicComparison", func(t *testing.T) {
		_, err := dasel.ParseSelector(".(x<2)")
		exp := &dasel.UnknownComparisonOperatorErr{Operator: "<"}
		if err == nil || err.Error() != exp.Error() {
			t.Errorf("expected error %v, got %v", exp, err)
		}
	})
}

func TestNode_Query(t *testing.T) {
	parser, err := storage.NewParserFromFilename("./file/example.json")
	if err != nil {
		t.Errorf("could not get parser: %s", err)
		return
	}

	value, err := storage.LoadFromFile("./file/example.json", parser)
	if err != nil {
		t.Errorf("could not load value from file: %s", err)
		return
	}

	t.Run("Valid", func(t *testing.T) {
		node, err := dasel.New(value).Query("preferences.favouriteColour")
		if err != nil {
			t.Errorf("unexpected query error: %s", err)
			return
		}
		if exp, got := "red", fmt.Sprint(node.InterfaceValue()); exp != got {
			t.Errorf("expected value `%s`, got `%s`", exp, got)
		}
	})
	t.Run("NotFound", func(t *testing.T) {
		_, err := dasel.New(value).Query(".colours.[0].a")
		expErr := fmt.Errorf("could not find value: selector [type:PROPERTY selector:.a] does not support value: [kind:string type:string] red")
		if err == nil {
			t.Errorf("expected err %v, got %v", expErr, err)
			return
		}
		if err.Error() != expErr.Error() {
			t.Errorf("\n expected err %v,  \ngot %v", expErr, err)
			return
		}
	})
	t.Run("InvalidSelector", func(t *testing.T) {
		_, err := dasel.New(value).Query(".colours.[a]")
		expErr := fmt.Errorf("failed to parse selector: %w", &dasel.InvalidIndexErr{Index: "a"})
		if err == nil {
			t.Errorf("expected err %v, got %v", expErr, err)
			return
		}
		if err.Error() != expErr.Error() {
			t.Errorf("expected err %v, got %v", expErr, err)
			return
		}
	})
}

func TestNode_Query_File(t *testing.T) {
	tests := []struct {
		Name     string
		Selector string
		Exp      string
	}{
		{Name: "Property", Selector: "name", Exp: "Tom"},
		{Name: "ChildProperty", Selector: "preferences.favouriteColour", Exp: "red"},
		{Name: "Index", Selector: "colours.[0]", Exp: "red"},
		{Name: "Index", Selector: "colours.[1]", Exp: "green"},
		{Name: "Index", Selector: "colours.[2]", Exp: "blue"},
		{Name: "IndexProperty", Selector: "colourCodes.[0].name", Exp: "red"},
		{Name: "IndexProperty", Selector: "colourCodes.[1].name", Exp: "green"},
		{Name: "IndexProperty", Selector: "colourCodes.[2].name", Exp: "blue"},
		{Name: "DynamicProperty", Selector: "colourCodes.(name=red).rgb", Exp: "ff0000"},
		{Name: "DynamicProperty", Selector: "colourCodes.(name=green).rgb", Exp: "00ff00"},
		{Name: "DynamicProperty", Selector: "colourCodes.(name=blue).rgb", Exp: "0000ff"},
		{Name: "MultipleDynamicProperty", Selector: "colourCodes.(name=red)(rgb=ff0000).name", Exp: "red"},
		{Name: "MultipleDynamicProperty", Selector: "colourCodes.(name=green)(rgb=00ff00).name", Exp: "green"},
		{Name: "MultipleDynamicProperty", Selector: "colourCodes.(name=blue)(rgb=0000ff).name", Exp: "blue"},
	}

	fileTest := func(filename string) func(t *testing.T) {
		return func(t *testing.T) {
			parser, err := storage.NewParserFromFilename(filename)
			if err != nil {
				t.Errorf("could not get parser: %s", err)
				return
			}

			value, err := storage.LoadFromFile(filename, parser)
			if err != nil {
				t.Errorf("could not load value from file: %s", err)
				return
			}

			for _, testCase := range tests {
				tc := testCase
				t.Run(tc.Name, func(t *testing.T) {
					node, err := dasel.New(value).Query(tc.Selector)
					if err != nil {
						t.Errorf("unexpected query error: %s", err)
						return
					}

					if exp, got := tc.Exp, fmt.Sprint(node.InterfaceValue()); exp != got {
						t.Errorf("expected value `%s`, got `%s`", exp, got)
					}
				})
			}
		}
	}

	t.Run("JSON", fileTest("./file/example.json"))
	t.Run("YAML", fileTest("../file/example.yaml"))
}

func TestNode_Query_Data(t *testing.T) {
	t.Run("ParentChildPathToProperty", func(t *testing.T) {
		rootNode := dasel.New(mapRoot)

		got, err := rootNode.Query(".a.b.c.thing")
		if err != nil {
			t.Errorf("unexpected query error: %v", err)
			return
		}

		if exp, got := "1", got.InterfaceValue().(string); exp != got {
			t.Errorf("expected %s, got %s", exp, got)
		}
	})
	t.Run("ParentChildPathToIndexProperty", func(t *testing.T) {
		rootNode := dasel.New(mapRoot)

		got, err := rootNode.Query(".a.b.people.[1].name")
		if err != nil {
			t.Errorf("unexpected query error: %v", err)
			return
		}

		if exp, got := "Amelia", got.InterfaceValue().(string); exp != got {
			t.Errorf("expected %s, got %s", exp, got)
		}
	})
	t.Run("ParentChildPathToDynamicProperty", func(t *testing.T) {
		rootNode := dasel.New(mapRoot)

		got, err := rootNode.Query(".a.b.people.(name=Tom).name")
		if err != nil {
			t.Errorf("unexpected query error: %v", err)
			return
		}

		if exp, got := "Tom", got.InterfaceValue().(string); exp != got {
			t.Errorf("expected %s, got %s", exp, got)
		}
	})
	t.Run("ParentChildPathToMultipleDynamicProperty", func(t *testing.T) {
		rootNode := dasel.New(mapRoot)

		got, err := rootNode.Query(".a.b.people.(name=Tom)(age=28).name")
		if err != nil {
			t.Errorf("unexpected query error: %v", err)
			return
		}

		if exp, got := "Tom", got.InterfaceValue().(string); exp != got {
			t.Errorf("expected %s, got %s", exp, got)
		}
	})
}

func putQueryTest(rootNode *dasel.Node, putSelector string, newValue interface{}, querySelector string) func(t *testing.T) {
	return func(t *testing.T) {
		err := rootNode.Put(putSelector, newValue)
		if err != nil {
			t.Errorf("unexpected put error: %v", err)
			return
		}

		got, err := rootNode.Query(querySelector)
		if err != nil {
			t.Errorf("unexpected query error: %v", err)
			return
		}

		if !reflect.DeepEqual(newValue, got.InterfaceValue()) {
			t.Errorf("expected %v, got %v", newValue, got.InterfaceValue())
		}
	}
}

func TestNode_Put(t *testing.T) {
	data := map[string]interface{}{
		"id": "123",
		"people": []map[string]interface{}{
			{
				"id":   1,
				"name": "Tom",
			},
			{
				"id":   2,
				"name": "Jim",
			},
		},
		"names": []string{
			"Tom",
			"Jim",
		},
	}
	rootNode := dasel.New(data)

	t.Run("InvalidSelector", func(t *testing.T) {
		err := rootNode.Put("people.[a].name", "Thomas")
		expErr := fmt.Errorf("failed to parse selector: %w", &dasel.InvalidIndexErr{Index: "a"})
		if err == nil {
			t.Errorf("expected err %v, got %v", expErr, err)
			return
		}
		if err.Error() != expErr.Error() {
			t.Errorf("expected err %v, got %v", expErr, err)
			return
		}
	})
	t.Run("ExistingSingleString", putQueryTest(rootNode, "id", "456", "id"))
	t.Run("ExistingStringValue", putQueryTest(rootNode, "people.[0].name", "Thomas", "people.(id=1).name"))
	t.Run("ExistingIntValue", putQueryTest(rootNode, "people.(id=1).id", 3, "people.(id=3).id"))
	t.Run("NewPropertyOnExistingObject", putQueryTest(rootNode, "people.(id=3).age", 27, "people.[0].age"))
	t.Run("AppendObjectToList", func(t *testing.T) {
		err := rootNode.Put("people.[]", map[string]interface{}{
			"id":   1,
			"name": "Bob",
		})
		if err != nil {
			t.Errorf("unexpected put error: %v", err)
			return
		}

		got, err := rootNode.Query("people.[2].id")
		if err != nil {
			t.Errorf("unexpected query [1] error: %v", err)
			return
		}
		if exp, got := 1, got.InterfaceValue().(int); exp != got {
			t.Errorf("expected %d, got %d", exp, got)
		}
		got, err = rootNode.Query("people.[2].name")
		if err != nil {
			t.Errorf("unexpected query [2] error: %v", err)
			return
		}
		if exp, got := "Bob", got.InterfaceValue().(string); exp != got {
			t.Errorf("expected %s, got %s", exp, got)
		}
	})
	t.Run("AppendStringToList", putQueryTest(rootNode, "names.[]", "Bob", "names.[2]"))
	t.Run("NilRootNode", putQueryTest(dasel.New(nil), "name", "Thomas", "name"))
	t.Run("NilChain", putQueryTest(dasel.New(nil), "my.name", "Thomas", "my.name"))
	t.Run("NilChainToListIndex", putQueryTest(dasel.New(nil), "my.favourite.people.[0]", "Tom", "my.favourite.people.[0]"))
	t.Run("NilChainToListNextAvailableIndex", putQueryTest(dasel.New(nil), "my.favourite.people.[]", "Tom", "my.favourite.people.[0]"))
	t.Run("NilChainToDynamic", putQueryTest(dasel.New(nil), "(name=Jim).name", "Tom", "[0].name"))
}
