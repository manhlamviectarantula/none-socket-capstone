package main

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to the database
	database.Connect()

	// Set up router
	router := gin.Default()

	router.Static("./upload", "./upload")

	// Configure CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true, // Allow cookies if needed
	}))

	// Register routes
	routes.MovieRoutes(router)
	routes.AuthRoutes(router)
	routes.RolePermissionRoutes(router)
	routes.BranchRoutes(router)
	routes.TheaterRoutes(router)
	routes.RowRoutes(router)
	routes.SeatRoutes(router)
	routes.ShowtimeRoutes(router)
	routes.AccountRoutes(router)
	routes.ShowtimeSeatRoutes(router)
	routes.OrderRoutes(router)
	routes.FoodRoutes(router)
	routes.OrderFoodRoutes(router)
	routes.ShowdateRoutes(router)

	// Start server on port 8080
	router.Run(":8080")
}
