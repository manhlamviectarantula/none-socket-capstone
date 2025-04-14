package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func MovieRoutes(router *gin.Engine) {
	movieGroup := router.Group("/movie")
	{
		movieGroup.POST("/add-movie", controllers.AddMovie)
		movieGroup.PUT("/update-movie/:MovieID", controllers.UpdateMovie)
		movieGroup.GET("/get-showing-movie", controllers.GetShowingMovie)
		movieGroup.GET("/get-upcoming-movie", controllers.GetUpcomingMovie)
		movieGroup.GET("/details-movie/:id", controllers.GetDetailsMovie)
		movieGroup.GET("/get-all-movie", controllers.GetAllMovies)
	}
}
