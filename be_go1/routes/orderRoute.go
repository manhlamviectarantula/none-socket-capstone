package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func OrderRoutes(router *gin.Engine) {
	orderGroup := router.Group("/order")
	{
		orderGroup.GET("/get-orders-of-account/:AccountID", controllers.GetOrdersOfAccount)
		orderGroup.POST("/add-order", controllers.AddOrder)
	}
}
