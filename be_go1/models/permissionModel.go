package models

type Permission struct {
	PermissionID   int    `gorm:"primaryKey;autoIncrement"`
	PermissionName string `gorm:"size:255;not null"`
}
