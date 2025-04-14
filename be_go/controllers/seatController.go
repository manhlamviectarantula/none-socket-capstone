package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AddSeat(c *gin.Context) {
	var seat models.Seat

	// Bind incoming JSON to the Branch struct
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set timestamps
	seat.CreatedAt = time.Now()
	seat.LastModified = time.Now()

	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the new seat to the database
	if err := database.DB.Create(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seat"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": seat})
}

func UpdateSeat(c *gin.Context) {
	var seat models.Seat
	id := c.Param("id")

	// Find seat by ID
	if err := database.DB.First(&seat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seat not found"})
		return
	}

	// Bind JSON data to seat struct
	if err := c.ShouldBindJSON(&seat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update last modified timestamp
	seat.LastModified = time.Now()

	// Save the updated seat to the database
	if err := database.DB.Save(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"data": seat})
}

func DeleteSeat(c *gin.Context) {
	var seat models.Seat
	id := c.Param("id")

	// Find seat by ID
	if err := database.DB.First(&seat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Seat not found"})
		return
	}

	// Delete seat from database
	if err := database.DB.Delete(&seat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete seat"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Seat deleted successfully"})
}

func AddSeats(c *gin.Context) {
	var seats []models.Seat

	// Bind incoming JSON to a slice of Seat structs
	if err := c.ShouldBindJSON(&seats); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set timestamps for each seat
	for i := range seats {
		seats[i].CreatedAt = time.Now()
		seats[i].LastModified = time.Now()
	}

	// Disable foreign key checks
	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the new seats to the database
	if err := database.DB.Create(&seats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create seats"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": seats})
}
