package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func SeatRoutes(router *gin.Engine) {
	seatGroup := router.Group("/seat")
	{
		seatGroup.POST("/add-seat", controllers.AddSeat)
		seatGroup.POST("/add-seats", controllers.AddSeats)
		seatGroup.PUT("/update-seat/:id", controllers.UpdateSeat)
		seatGroup.DELETE("/delete-seat/:id", controllers.DeleteSeat)
	}
}
