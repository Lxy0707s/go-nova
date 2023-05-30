package model

type User struct {
	//dao.Extra
	//dao.Model

	Name    string `json:"name,omitempty" gorm:"column:name"`
	ID      int    `json:"id,omitempty" gorm:"column:id;primary_key"`
	Address string `json:"address" gorm:"column:address"`
	Email   string `json:"email" gorm:"column:address"`
}

func (User) TableName() string {
	return "nova.user"
}
