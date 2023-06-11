package gen_model

type User struct {
	ID      int64  `json:"id" gorm:"column:id;primary_key"`
	Name    string `json:"name" gorm:"column:name"`
	Address string `json:"address" gorm:"column:address"`
	Email   string `json:"email" gorm:"column:address"`

	//dao.Extra
	//dao.Model
}

type NewUser struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Email   string `json:"email"`
}

type UserID struct {
	ID int64 `json:"id"`
}
