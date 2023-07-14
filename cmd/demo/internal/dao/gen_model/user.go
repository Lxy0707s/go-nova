package gen_model

type User struct {
	ID       int64  `json:"id" gorm:"column:id;primary_key"`
	UserName string `json:"username" gorm:"column:username"`
	Password string `json:"password" gorm:"column:password"`
	Address  string `json:"address" gorm:"column:address"`
	Email    string `json:"email" gorm:"column:address"`
	Phone    string `json:"phone"  gorm:"column:phone"`
	Status   string `json:"status"  gorm:"column:status"`

	//dao.Extra
	//dao.Model
}

type NewUser struct {
	UserName string `json:"username"`
	Address  string `json:"address"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Status   string `json:"status"`
}

type UserID struct {
	ID int64 `json:"id"`
}
