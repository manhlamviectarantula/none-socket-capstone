package models

import "time"

type Row struct {
	RowID          int       `json:"row_id" gorm:"primaryKey"`                // Row ID (PK)
	TheaterID      int       `json:"theater_id" gorm:"foreignKey:theater_id"` // Theater ID
	RowName        string    `json:"row_name"`                                // Row Name
	RowOrder       int       `json:"row_order"`                               // Row Position
	CreatedAt      time.Time `json:"created_at"`                              // Creation Date
	CreatedBy      string    `json:"created_by"`                              // Created By
	LastModified   time.Time `json:"last_modified"`                           // Last Modified Date
	LastModifiedBy string    `json:"last_modified_by"`                        // Last Modified By

	Theater Theater `gorm:"foreignKey:theater_id"`
}

// type Row struct {
// 	RowID          int       `json:"row_id" gorm:"primaryKey"`                // Row ID (PK)
// 	TheaterID      int       `json:"theater_id" gorm:"foreignKey:theater_id"` // Theater ID
// 	RowName        string    `json:"row_name"`                                // Row Name
// 	RowOrder       int       `json:"row_order"`                               // Row Position
// 	CreatedAt      time.Time `json:"created_at"`                              // Creation Date
// 	CreatedBy      string    `json:"created_by"`                              // Created By
// 	LastModified   time.Time `json:"last_modified"`                           // Last Modified Date
// 	LastModifiedBy string    `json:"last_modified_by"`                        // Last Modified By

// 	Theater Theater `gorm:"foreignKey:TheaterID;references:TheaterID"`
// }
