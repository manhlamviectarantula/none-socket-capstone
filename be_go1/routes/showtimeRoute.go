package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func ShowtimeRoutes(router *gin.Engine) {
	showtimeGroup := router.Group("/showtime")
	{
		showtimeGroup.GET("/get-all-showtimes-of-movie/:movieid", controllers.GetAllShowtimesOfMovie)
		showtimeGroup.GET("/get-showtimes-info-in-selectSeat/:ShowtimeID", controllers.GetShowtimeInfo)
		showtimeGroup.GET("/get-all-showtimes-of-branch/:BranchID", controllers.GetAllShowtimesOfBranch)

		showtimeGroup.POST("/add-showtime", controllers.AddShowtime)
		showtimeGroup.GET("/get-details-showtime/:ShowtimeID", controllers.GetDetailsShowtime)
		showtimeGroup.DELETE("/delete-showtime/:ShowtimeID", controllers.DeleteShowtime)
	}
}
