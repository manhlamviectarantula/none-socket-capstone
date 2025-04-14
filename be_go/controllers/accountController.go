package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func UpdateAccount(c *gin.Context) {
	var account models.Account

	// Get the account ID from the URL
	accountID := c.Param("id")

	// Find the account by ID
	if err := database.DB.First(&account, accountID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Account not found"})
		return
	}

	// Bind incoming JSON to the Account struct
	if err := c.ShouldBindJSON(&account); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the LastModified timestamp
	account.LastModifiedAt = time.Now()

	// Save the updated account to the database
	if err := database.DB.Save(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update account"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"data": account})
}
