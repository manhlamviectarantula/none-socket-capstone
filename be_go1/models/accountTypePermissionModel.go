package models

type AccountTypePermission struct {
	AccountTypeID int `gorm:"not null"`
	PermissionID  int `gorm:"not null"`
}

// type AccountTypePermission struct {
// 	AccountTypeID int `json:"account_type_id" gorm:"foreignKey:account_type_id"` // Khóa ngoại, liên kết đến AccountTypeID trong AccountType
// 	PermissionID  int `json:"permission_id" gorm:"foreignKey:permission_id"`     // Khóa ngoại, liên kết đến PermissionID trong Permission

// 	AccountType AccountType `gorm:"foreignKey:AccountTypeID;references:AccountTypeID"`
// 	Permission  Permission  `gorm:"foreignKey:PermissionID;references:PermissionID"`
// }
