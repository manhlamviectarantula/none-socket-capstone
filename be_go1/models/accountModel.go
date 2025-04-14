package models

import "time"

type Account struct {
	AccountID     int       `json:"AccountID" gorm:"column:AccountID;primaryKey;autoIncrement"`
	AccountTypeID int       `json:"AccountTypeID" gorm:"column:AccountTypeID;not null"`
	BranchID      *int      `json:"BranchID" gorm:"column:BranchID;default:null"` // Nullable
	Email         string    `json:"Email" gorm:"column:Email;size:100;unique;not null"`
	PhoneNumber   string    `json:"PhoneNumber" gorm:"column:PhoneNumber;size:15;not null"`
	FullName      string    `json:"FullName" gorm:"column:FullName;size:100;not null"`
	BirthDate     string    `json:"BirthDate" gorm:"column:BirthDate;size:100;not null"`
	Password      string    `json:"Password" gorm:"column:Password;size:255;not null"`
	Status        bool      `json:"Status" gorm:"column:Status;default:true"`
	CreatedAt     time.Time `json:"CreatedAt" gorm:"column:CreatedAt;autoCreateTime"`
	LastUpdatedAt time.Time `json:"LastUpdatedAt" gorm:"column:LastUpdatedAt;autoUpdateTime"`
}
