package model

import (
	"time"
)

type NewUser struct {
	PUsername    string `gorm:"column:username" json:"username"`
	PPassword    string `gorm:"column:password" json:"password"`
	PPhone       string `gorm:"column:phone" json:"phone"`
	PAddress     string `gorm:"column:address" json:"address"`
	PEmail       string `gorm:"column:email" json:"email"`
	PRoleId      int64  `gorm:"column:role_id" json:"role_id"`       //  角色id
	PConditions  int64  `gorm:"column:conditions" json:"conditions"` //  部门id
	PDescription string `gorm:"column:desc" json:"desc"`
}

type SysUser struct {
	PID  int64 `gorm:"column:id" json:"id"`
	PUid int64 `gorm:"column:uid" json:"uid"`

	PUserName    string `gorm:"column:username" json:"username"`
	PPassword    string `gorm:"column:password" json:"password"`
	PPhone       string `gorm:"column:phone" json:"phone"`
	PAddress     string `gorm:"column:address" json:"address"`
	PEmail       string `gorm:"column:email" json:"email"`
	PRoleId      int64  `gorm:"column:role_id" json:"role_id"`       //  角色id
	PConditions  int64  `gorm:"column:conditions" json:"conditions"` //  部门id
	PDescription string `gorm:"column:desc" json:"desc"`

	PCreatedAt time.Time `gorm:"column:created_at" json:"created_at"`
	PUpdatedAt time.Time `gorm:"column:updated_at" json:"updated_at"`
}

func (SysUser) TableName() string {
	return "polaris.sys_user"
}

type UserID struct {
	ID *Qid
}

type Qid struct {
	Id int32 `json:"id"`
}

func (u *SysUser) UID() *int32 {
	uid := int32(u.PUid)
	return &uid
}

func (u *SysUser) RoleId() int32 {
	rId := int32(u.PRoleId)
	return rId
}

func (u *SysUser) UserName() string {
	return u.PUserName
}

func (u *SysUser) Password() string {
	return u.PPassword
}

func (u *SysUser) Address() string {
	return u.PAddress
}

func (u *SysUser) Email() string {
	return u.PEmail
}

func (u *SysUser) Phone() string {
	return u.PPhone
}

func (u *SysUser) Desc() *string {
	return &u.PDescription
}

func (u *SysUser) Conditions() int32 {
	return int32(u.PConditions)
}
