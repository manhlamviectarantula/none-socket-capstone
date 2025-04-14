package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func TheaterRoutes(router *gin.Engine) {
	theaterGroup := router.Group("/theater")
	{
		theaterGroup.GET("/get-all-theater-of-branch/:BranchID", controllers.GetAllTheaterOfBranch)
		theaterGroup.GET("/get-details-theater/:TheaterID", controllers.GetDetailsTheater)
		theaterGroup.GET("/get-seats-of-theater/:TheaterID", controllers.GetSeatsOfTheater)
		theaterGroup.POST("/add-theater", controllers.AddTheater)
		theaterGroup.PUT("/update-theater/:id", controllers.UpdateTheater)
		theaterGroup.DELETE("/delete-theater/:id", controllers.DeleteTheater)
	}
}
