package models

import "time"

type Order struct {
	OrderID     int         `gorm:"column:OrderID;primaryKey;autoIncrement"`
	BranchID    int         `gorm:"column:BranchID;not null"`
	AccountID   int         `gorm:"column:AccountID;not null"`
	MovieName   string      `gorm:"column:MovieName;not null"`
	TheaterName string      `gorm:"column:TheaterName;not null"`
	BranchName  string      `gorm:"column:BranchName;not null"`
	ShowDate    string      `gorm:"column:ShowDate;not null"`
	StartTime   string      `gorm:"column:StartTime;not null"`
	Seat        string      `gorm:"column:Seat;not null"`
	Total       int         `gorm:"column:Total;not null"`
	CreatedAt   time.Time   `gorm:"column:CreatedAt;autoCreateTime"`
	OrderFoods  []OrderFood `json:"OrderFoods" gorm:"foreignKey:OrderID"`
}
