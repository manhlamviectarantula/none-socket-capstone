package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func RowRoutes(router *gin.Engine) {
	rowGroup := router.Group("/row")
	{
		rowGroup.POST("/add-row", controllers.AddRow)
		rowGroup.POST("/add-rows", controllers.AddRows)
		rowGroup.DELETE("/delete-row/:id", controllers.DeleteRow)
	}
}
