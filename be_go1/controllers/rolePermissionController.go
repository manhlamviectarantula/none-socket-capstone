package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddAccountType(c *gin.Context) {
	// Declare a variable to hold the incoming account type data
	var accountType models.AccountType

	// Bind the JSON request body to the accountType struct
	if err := c.ShouldBindJSON(&accountType); err != nil {
		// If binding fails, return a 400 Bad Request response
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert the new account type into the database using GORM
	if err := database.DB.Create(&accountType).Error; err != nil {
		// If insertion fails, return a 500 Internal Server Error response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account type"})
		return
	}

	// Return a success response with the created account type data
	c.JSON(http.StatusOK, gin.H{"message": "Account type created successfully", "data": accountType})
}

func AddPermission(c *gin.Context) {
	var permission models.Permission

	// Bind the JSON request body to the accountType struct
	if err := c.ShouldBindJSON(&permission); err != nil {
		// If binding fails, return a 400 Bad Request response
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert the new account type into the database using GORM
	if err := database.DB.Create(&permission).Error; err != nil {
		// If insertion fails, return a 500 Internal Server Error response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account type"})
		return
	}

	// Return a success response with the created account type data
	c.JSON(http.StatusOK, gin.H{"message": "Account type created successfully", "data": permission})
}

func AddAccountTypePermission(c *gin.Context) {
	// Declare a variable to hold the incoming account type permission data
	var accountTypePermission models.AccountTypePermission

	// Bind the JSON request body to the accountTypePermission struct
	if err := c.ShouldBindJSON(&accountTypePermission); err != nil {
		// If binding fails, return a 400 Bad Request response
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert the new account type permission relationship into the database using GORM
	if err := database.DB.Create(&accountTypePermission).Error; err != nil {
		// If insertion fails, return a 500 Internal Server Error response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account type permission"})
		return
	}

	// Return a success response with the created account type permission data
	c.JSON(http.StatusOK, gin.H{
		"message": "Account type permission created successfully",
		"data":    accountTypePermission,
	})
}
