package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddShowtime(c *gin.Context) {
	var showtime models.Showtime

	// Bind incoming JSON to the Branch struct
	if err := c.ShouldBindJSON(&showtime); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set timestamps
	showtime.CreatedAt = time.Now()
	// showtime.LastModified = time.Now()

	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the new showtime to the database
	if err := database.DB.Create(&showtime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create showtime"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": showtime})
}

func DeleteShowtime(c *gin.Context) {
	// Get showtime ID from the URL parameter
	id := c.Param("id")

	// Find the showtime by ID
	var showtime models.Showtime
	if err := database.DB.First(&showtime, id).Error; err != nil {
		if gorm.ErrRecordNotFound == err {
			c.JSON(http.StatusNotFound, gin.H{"error": "Showtime not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find showtime"})
		return
	}

	// Delete the showtime
	if err := database.DB.Delete(&showtime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete showtime"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Showtime deleted successfully"})
}
