package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func BranchRoutes(router *gin.Engine) {
	branchGroup := router.Group("/branch")
	{
		branchGroup.GET("/get-all-branch", controllers.GetAllBranch)
		branchGroup.GET("/get-details-branch/:BranchID", controllers.GetDetailsBranch)
		branchGroup.POST("/add-branch", controllers.AddBranch)
		branchGroup.PUT("/update-branch/:id", controllers.UpdateBranch)
	}
}
