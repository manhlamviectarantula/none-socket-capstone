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

// package database

// import (
// 	"log"

// 	"gorm.io/driver/postgres"
// 	"gorm.io/gorm"
// )

// var DB *gorm.DB

// func Connect() {
// 	// Set up the DSN (Data Source Name) for the postgres connection
// 	dsn := "myuser:manh@tcp(127.0.0.1:5432)/cinema?charset=utf8mb4&parseTime=True&loc=Local"
// 	// dsn := "host=dpg-ct1c2d8gph6c73bhbn30-a.oregon-postgres.render.com user=capstone_postgres_9i0o_user password=Uf8WzH0wsa5JgjqwEgPrbv7UnwrOzIyj dbname=capstone_postgres_9i0o port=5432 sslmode=require TimeZone=Asia/Shanghai"
// 	var err error

// 	// Establish the connection to the database
// 	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
// 	if err != nil {
// 		log.Fatalf("Failed to connect to the database: %v", err)
// 	}

// 	log.Println("Successfully connected to the database")
// }
