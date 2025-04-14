package routes

import (
	"movie-ticket-booking/controllers"
	"movie-ticket-booking/middleware"

	"github.com/gin-gonic/gin"
)

func AccountRoutes(router *gin.Engine) {
	accountGroup := router.Group("/account")
	{
		accountGroup.GET("/get-all-accounts", controllers.GetAllAccounts)
		accountGroup.GET("/get-details-account/:AccountID", controllers.GetDetailsAccount)
		accountGroup.PUT("/change-account-status/:AccountID", controllers.BlockAccount)
		accountGroup.PUT("/update-account/:AccountID", middleware.RequireLogin, controllers.UpdateAccount)
		accountGroup.PUT("/update-pw/:id", middleware.RequireLogin, controllers.UpdatePassword)
	}
}
