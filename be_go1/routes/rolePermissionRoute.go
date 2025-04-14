package routes

import (
	"movie-ticket-booking/controllers"

	"github.com/gin-gonic/gin"
)

func RolePermissionRoutes(router *gin.Engine) {
	rolePermissionGroup := router.Group("/role")
	{
		rolePermissionGroup.POST("/add-account-type", controllers.AddAccountType)
		rolePermissionGroup.POST("/add-permission", controllers.AddPermission)
		rolePermissionGroup.POST("/add-accountType-permission", controllers.AddAccountTypePermission)
	}
}
