package models

type ShowDate struct {
	ShowDateID int    `gorm:"primaryKey;autoIncrement;column:ShowDateID"`
	ShowDate   string `gorm:"unique;not null;column:ShowDate"`
	Status     int    `gorm:"default:1;column:Status"`
}
