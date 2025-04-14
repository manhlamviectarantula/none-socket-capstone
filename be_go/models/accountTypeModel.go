package models

type AccountType struct {
	AccountTypeID   int    `json:"account_type_id" gorm:"primaryKey"` // Khóa chính
	AccountTypeName string `json:"account_type_name"`
}
