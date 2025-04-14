package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func BranchRoutes(router *gin.Engine) {
	branchGroup := router.Group("/branch")
	{
		branchGroup.POST("/add-branch", controllers.AddBranch)
		branchGroup.PUT("/update-branch/:id", controllers.UpdateBranch)
	}
}
