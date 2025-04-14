package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func ShowdateRoutes(router *gin.Engine) {
	showdateGroup := router.Group("/showdate")
	{
		showdateGroup.POST("/add-showdate", controllers.AddShowDate)
		showdateGroup.GET("/get-showdate", controllers.GetShowDate)
	}
}
