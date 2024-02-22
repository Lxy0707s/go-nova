package graphql

import (
	"fmt"
)

// 为了开发效率而被逼着集成，虽然不太好但不得已而为之。
const DataKey = "data"

type Json map[string]interface{}

func (Json) ImplementsGraphQLType(name string) bool { return name == "Json" }

func (j *Json) UnmarshalGraphQL(input interface{}) error {
	switch input := input.(type) {
	case Json:
		*j = input
		return nil
	default:
		return fmt.Errorf("wrong type")
	}
}
