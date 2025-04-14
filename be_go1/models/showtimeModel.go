package models

import "time"

type Showtime struct {
	ShowtimeID int       `gorm:"primaryKey;autoIncrement;column:ShowtimeID"`
	TheaterID  int       `gorm:"not null;column:TheaterID"`
	MovieID    int       `gorm:"not null;column:MovieID"`
	ShowDate   string    `gorm:"not null;column:ShowDate"`
	StartTime  string    `gorm:"not null;column:StartTime"`
	EndTime    string    `gorm:"not null;column:EndTime"`
	Status     int       `gorm:"not null;column:Status"`
	CreatedAt  time.Time `gorm:"autoCreateTime;column:CreatedAt"`
	CreatedBy  string    `gorm:"size:100;not null;column:CreatedBy"`

	Theater *Theater `gorm:"foreignKey:TheaterID;references:TheaterID"`
	Movie   *Movie   `gorm:"foreignKey:MovieID;references:MovieID"`
}

// type Showtime struct {
// 	ShowtimeID int       `gorm:"primaryKey;autoIncrement;column:ShowtimeID"`
// 	TheaterID  int       `gorm:"not null;column:TheaterID" json:"theater_id"`
// 	MovieID    int       `gorm:"not null;column:MovieID" json:"movie_id"`
// 	ShowDate   string    `gorm:"not null;column:ShowDate" json:"show_date"`
// 	StartTime  string    `gorm:"not null;column:StartTime" json:"start_time"`
// 	EndTime    string    `gorm:"not null;column:EndTime" json:"end_time"`
// 	Status     int       `gorm:"not null;column:Status" json:"status"`
// 	CreatedAt  time.Time `gorm:"autoCreateTime;column:CreatedAt"`
// 	CreatedBy  string    `gorm:"size:100;not null;column:CreatedBy" json:"created_by"`

// 	Theater *Theater `gorm:"foreignKey:TheaterID;references:TheaterID" json:"-"`
// 	Movie   *Movie   `gorm:"foreignKey:MovieID;references:MovieID" json:"-"`
// }
