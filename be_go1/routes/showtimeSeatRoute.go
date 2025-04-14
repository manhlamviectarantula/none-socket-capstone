package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func ShowtimeSeatRoutes(router *gin.Engine) {
	showtimeSeatGroup := router.Group("/showtime-seat")
	{
		showtimeSeatGroup.GET("/get-seat-of-showtime", controllers.GetShowtimeSeat)
		showtimeSeatGroup.PUT("/update-showtime-seat-status", controllers.UpdateShowtimeSeatStatus)

		showtimeSeatGroup.POST("/add-showtime-seats/:ShowtimeID/:TheaterID", controllers.AddShowtimeSeats)
		showtimeSeatGroup.DELETE("/delete-showtime-seats/:ShowtimeID", controllers.DeleteShowtimeSeats)

		// showtimeSeatGroup.POST("/add-showtime", controllers.AddShowtime)
		// showtimeSeatGroup.DELETE("/delete-showtime/:id", controllers.DeleteShowtime)
	}
}
