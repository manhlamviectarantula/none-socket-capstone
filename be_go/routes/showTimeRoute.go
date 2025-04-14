package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func ShowTimeRoutes(router *gin.Engine) {
	showTimeGroup := router.Group("/showTime")
	{
		showTimeGroup.POST("/add-showtime", controllers.AddShowtime)
		showTimeGroup.DELETE("/delete-showtime/:id", controllers.DeleteShowtime)
	}
}
