package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func TheaterRoutes(router *gin.Engine) {
	theaterGroup := router.Group("/theater")
	{
		theaterGroup.POST("/add-theater", controllers.AddTheater)
		theaterGroup.PUT("/update-theater/:id", controllers.UpdateTheater)
		theaterGroup.DELETE("/delete-theater/:id", controllers.DeleteTheater)
		theaterGroup.GET("/get-theater/:id", controllers.GetTheater)
	}
}
