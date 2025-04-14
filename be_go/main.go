package main

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to the database
	database.Connect()

	// Perform AutoMigrate
	// database.AutoMigrate(database.DB)

	// Set up router and routes
	router := gin.Default()
	routes.MovieRoutes(router)
	routes.AuthRoutes(router)
	routes.RolePermissionRoutes(router)
	routes.BranchRoutes(router)
	routes.TheaterRoutes(router)
	routes.RowRoutes(router)
	routes.SeatRoutes(router)
	routes.ShowTimeRoutes(router)
	routes.AccountRoutes(router)

	router.Run(":8080") // Start server on port 8080
}
