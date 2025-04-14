package models

import "time"

type TicketOrder struct {
	TicketOrderID int       `json:"ticket_order_id" gorm:"primaryKey"`         // Order ID (PK)
	BranchID      int       `json:"branch_id" gorm:"foreignKey:branch_id"`     // Branch ID (FK)
	AccountID     int       `json:"account_id" gorm:"foreignKey:account_id"`   // Account ID (FK)
	ShowtimeID    int       `json:"showtime_id" gorm:"foreignKey:showtime_id"` // Showtime ID (FK)
	SeatID        int       `json:"seat_id" gorm:"foreignKey:seat_id"`         // Seat ID (FK)
	Total         float64   `json:"total"`                                     // Total
	CreatedAt     time.Time `json:"created_at"`                                // Creation Date

	Branch   Branch   `gorm:"foreignKey:branch_id"`
	Account  Account  `gorm:"foreignKey:account_id"`
	Showtime Showtime `gorm:"foreignKey:showtime_id"`
	Seat     Seat     `gorm:"foreignKey:seat_id"`
}

// type TicketOrder struct {
// 	OrderID    int       `json:"order_id" gorm:"primaryKey"`              // Order ID (PK)
// 	BranchID   int       `json:"branch_id"`                               // Branch ID (FK)
// 	AccountID  int       `json:"account_id" gorm:"foreignKey:account_id"` // Account ID (FK)
// 	ShowtimeID int       `json:"showtime_id"`                             // Showtime ID (FK)
// 	SeatID     int       `json:"seat_id"`                                 // Seat ID (FK)
// 	Total      float64   `json:"total"`                                   // Total
// 	CreatedAt  time.Time `json:"created_at"`                              // Creation Date

// 	Branch   Branch   `gorm:"foreignKey:BranchID;references:BranchID"`     // Relationship to Branch
// 	Account  Account  `gorm:"foreignKey:AccountID;references:AccountID"`   // Relationship to Account
// 	Showtime Showtime `gorm:"foreignKey:ShowtimeID;references:ShowtimeID"` // Relationship to Showtime
// 	Seat     Seat     `gorm:"foreignKey:SeatID;references:SeatID"`         // Relationship to Seat
// }
