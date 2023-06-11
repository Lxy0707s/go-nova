package gen_model

type User struct {
	ID      int64  `json:"id,omitempty" gorm:"column:id;primary_key"`
	Name    string `json:"name" gorm:"column:name"`
	Address string `json:"address" gorm:"column:address"`
	Email   string `json:"email" gorm:"column:address"`

	//dao.Extra
	//dao.Model
}

func (User) TableName() string {
	return "nova.user"
}
