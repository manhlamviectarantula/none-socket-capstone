package models

type OrderFood struct {
	OrderFoodID int    `gorm:"column:OrderFoodID;primaryKey;autoIncrement"`
	OrderID     int    `gorm:"column:OrderID;not null"`
	FoodName    string `gorm:"column:FoodName;not null"`
	Description string `gorm:"column:Description;not null"`
	Price       int    `gorm:"column:Price;not null"`
	Quantity    int    `gorm:"column:Quantity;not null"`
}
