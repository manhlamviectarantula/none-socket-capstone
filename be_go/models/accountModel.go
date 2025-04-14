package models

import "time"

type Account struct {
	AccountID      int       `json:"account_id" gorm:"primaryKey"`                      // Khóa chính
	AccountTypeID  int       `json:"account_type_id" gorm:"foreignKey:account_type_id"` // Khóa ngoại, liên kết đến AccountType
	BranchID       *int      `json:"branch_id" gorm:"foreignKey:branch_id"`
	Email          string    `json:"email" gorm:"unique"`
	PhoneNumber    string    `json:"phoneNumber" gorm:"unique"`
	FullName       string    `json:"fullName"`
	BirthDate      time.Time `json:"birthDate"`
	Password       string    `json:"password"`
	Status         bool      `json:"status"`
	CreatedAt      time.Time `json:"createdAt"`
	LastModifiedAt time.Time `json:"lastModifiedAt"`

	AccountType AccountType `gorm:"foreignKey:account_type_id"`
	Branch      Branch      `gorm:"foreignKey:branch_id"`

	// TicketOrders []TicketOrder `gorm:"foreignKey:account_id"`
}

// type Account struct {
// 	AccountID      int       `json:"account_id" gorm:"primaryKey"` // Primary Key
// 	AccountTypeID  int       `json:"account_type_id"`              // Foreign Key, links to AccountType
// 	BranchID       *int      `json:"branchID"`                     // Foreign Key, links to Branch
// 	Email          string    `json:"email" gorm:"unique"`
// 	PhoneNumber    string    `json:"phoneNumber" gorm:"unique"`
// 	FullName       string    `json:"fullName"`
// 	BirthDate      time.Time `json:"birthDate"`
// 	Password       string    `json:"password"`
// 	Status         bool      `json:"status"`
// 	CreatedAt      time.Time `json:"createdAt"`
// 	LastModifiedAt time.Time `json:"lastModifiedAt"`

// 	AccountType AccountType `gorm:"foreignKey:AccountTypeID;references:AccountTypeID"` // Relationship to AccountType
// 	Branch      Branch      `gorm:"foreignKey:BranchID;references:BranchID"`           // Relationship to Branch
// }
