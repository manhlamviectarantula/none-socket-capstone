package models

import "time"

type Theater struct {
	TheaterID      int       `json:"theater_id" gorm:"primaryKey"`          // Theater ID (PK)
	BranchID       int       `json:"branch_id" gorm:"foreignKey:branch_id"` // Branch ID
	TheaterName    string    `json:"theater_name"`                          // Theater Name
	Slug           string    `json:"slug"`                                  // Identifier
	TheaterType    string    `json:"theater_type"`                          // Theater Type
	TotalSeats     int       `json:"total_seats"`                           // Total Seats
	CreatedAt      time.Time `json:"created_at"`                            // Creation Date
	CreatedBy      string    `json:"created_by"`                            // Created By
	LastModified   time.Time `json:"last_modified"`                         // Last Modified Date
	LastModifiedBy string    `json:"last_modified_by"`                      // Last Modified By

	Branch Branch `gorm:"foreignKey:branch_id"`
}

// type Theater struct {
// 	TheaterID      int       `json:"theater_id" gorm:"primaryKey"`          // Theater ID (PK)
// 	BranchID       int       `json:"branch_id" gorm:"foreignKey:branch_id"` // Branch ID
// 	TheaterName    string    `json:"theater_name"`                          // Theater Name
// 	Slug           string    `json:"slug"`                                  // Identifier
// 	TheaterType    string    `json:"theater_type"`                          // Theater Type
// 	TotalSeats     int       `json:"total_seats"`                           // Total Seats
// 	CreatedAt      time.Time `json:"created_at"`                            // Creation Date
// 	CreatedBy      string    `json:"created_by"`                            // Created By
// 	LastModified   time.Time `json:"last_modified"`                         // Last Modified Date
// 	LastModifiedBy string    `json:"last_modified_by"`                      // Last Modified By

// 	Branch Branch `gorm:"foreignKey:BranchID;references:BranchID"`
// }
