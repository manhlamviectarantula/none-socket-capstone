package models

type ShowtimeSeat struct {
	ShowtimeSeatID int    `gorm:"primaryKey;autoIncrement;column:ShowtimeSeatID"`
	ShowtimeID     int    `gorm:"not null;column:ShowtimeID"`
	SeatID         int    `gorm:"not null;column:SeatID"`
	RowName        string `gorm:"not null;column:RowName"`
	TicketPrice    int    `gorm:"not null;column:TicketPrice"`
	Status         bool   `gorm:"default:0;column:Status"`
}
