package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func AccountRoutes(router *gin.Engine) {
	accountGroup := router.Group("/account")
	{
		accountGroup.PUT("/update-account/:id", controllers.UpdateAccount)
	}
}
