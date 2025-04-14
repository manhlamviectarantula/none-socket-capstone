package models

type Permission struct {
	PermissionID   int    `json:"permission_id" gorm:"primaryKey"` // Khóa chính
	PermissionName string `json:"permission_name"`
}
