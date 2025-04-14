package models

import "time"

type Seat struct {
	SeatID     int `json:"seat_id" gorm:"primaryKey"`       // Seat ID (PK)
	RowID      int `json:"row_id" gorm:"foreignKey:row_id"` // Row ID (FK)
	SeatNumber int `json:"seat_number"`                     // Seat Number
	Area       int `json:"area"`                            // Occupied Position
	// ColumnPosition int     `json:"column_position"`                 // Column Position
	// RowPosition    int     `json:"row_position"`                    // Row Position
	Status         int       `json:"status"`           // Status
	SeatPrice      float64   `json:"seat_price"`       // Seat Price
	Description    string    `json:"description"`      // Description
	SeatType       int       `json:"seat_type"`        // Seat Type
	CreatedAt      time.Time `json:"created_at"`       // Creation Date
	CreatedBy      string    `json:"created_by"`       // Created By
	LastModified   time.Time `json:"last_modified"`    // Last Modified Date
	LastModifiedBy string    `json:"last_modified_by"` // Last Modified By

	Row Row `gorm:"foreignKey:row_id"`
}

// type Seat struct {
// 	SeatID     int `json:"seat_id" gorm:"primaryKey"`       // Seat ID (PK)
// 	RowID      int `json:"row_id" gorm:"foreignKey:row_id"` // Row ID (FK)
// 	SeatNumber int `json:"seat_number"`                     // Seat Number
// 	Area       int `json:"area"`                            // Occupied Position
// 	// ColumnPosition int     `json:"column_position"`                 // Column Position
// 	// RowPosition    int     `json:"row_position"`                    // Row Position
// 	Status      string  `json:"status"`      // Status
// 	SeatPrice   float64 `json:"seat_price"`  // Seat Price
// 	Description string  `json:"description"` // Description
// 	SeatType    string  `json:"seat_type"`   // Seat Type

// 	Row Row `gorm:"foreignKey:RowID;references:RowID"`
// }
