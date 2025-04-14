package database

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	// Set up the DSN (Data Source Name) for the MySQL connection
	dsn := "root:manh@tcp(127.0.0.1:3306)/cinema?charset=utf8mb4&parseTime=True&loc=Local"
	var err error

	// Establish the connection to the database
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	log.Println("Successfully connected to the database")
}
