package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func MovieRoutes(router *gin.Engine) {
	movieGroup := router.Group("/movie")
	{
		movieGroup.POST("/add-movie", controllers.AddMovie)
		movieGroup.PUT("/update-movie/:id", controllers.UpdateMovie)
		movieGroup.GET("/getAll-movie", controllers.GetAllMovies)
	}
}
