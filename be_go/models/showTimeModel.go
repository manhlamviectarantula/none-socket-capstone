package models

import "time"

type Showtime struct {
	ShowtimeID int       `json:"showtime_id" gorm:"primaryKey"`           // Showtime ID (PK)
	TheaterID  int       `json:"theater_id" gorm:"foreignKey:theater_id"` // Theater ID (FK)
	MovieID    int       `json:"movie_id" gorm:"foreignKey:movie_id"`     // Movie ID (FK)
	ShowDate   time.Time `json:"show_date"`                               // Show Date
	ShowTime   time.Time `json:"show_time"`                               // Show Time
	CreatedAt  time.Time `json:"created_at"`                              // Creation Date
	CreatedBy  string    `json:"created_by"`                              // Created By

	Theater Theater `gorm:"foreignKey:theater_id"`
	Movie   Movie   `gorm:"foreignKey:movie_id"`
}

// type Showtime struct {
// 	ShowtimeID int `json:"showtime_id" gorm:"primaryKey"`           // Showtime ID (PK)
// 	TheaterID  int `json:"theater_id" gorm:"foreignKey:theater_id"` // Theater ID (FK)
// 	MovieID    int `json:"movie_id" gorm:"foreignKey:movie_id"`     // Movie ID (FK)
// 	// ShowtimePrice float64   `json:"showtime_price"`                          // Showtime Price
// 	ShowDate  time.Time `json:"show_date"`  // Show Date
// 	ShowTime  time.Time `json:"show_time"`  // Show Time
// 	CreatedAt time.Time `json:"created_at"` // Creation Date
// 	CreatedBy string    `json:"created_by"` // Created By

// 	Theater Theater `gorm:"foreignKey:TheaterID;references:TheaterID"`
// 	Movie   Movie   `gorm:"foreignKey:MovieID;references:MovieID"`
// }
