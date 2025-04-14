package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AddTheater(c *gin.Context) {
	var theater models.Theater

	// Bind incoming JSON to the Branch struct
	if err := c.ShouldBindJSON(&theater); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set timestamps
	theater.CreatedAt = time.Now()
	theater.LastModified = time.Now()

	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the new theater to the database
	if err := database.DB.Create(&theater).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create theater"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": theater})
}

func UpdateTheater(c *gin.Context) {
	var theater models.Theater
	id := c.Param("id")

	// Find existing theater by ID
	if err := database.DB.First(&theater, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Theater not found"})
		return
	}

	// Bind incoming JSON to the Theater struct
	if err := c.ShouldBindJSON(&theater); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update last modified timestamp
	theater.LastModified = time.Now()

	// Save the updated theater to the database
	if err := database.DB.Save(&theater).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update theater"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"data": theater})
}

func DeleteTheater(c *gin.Context) {
	id := c.Param("id")
	var theater models.Theater

	// Find existing theater by ID
	if err := database.DB.First(&theater, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Theater not found"})
		return
	}

	// Delete the theater from the database
	if err := database.DB.Delete(&theater).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete theater"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Theater deleted successfully"})
}

func GetTheater(c *gin.Context) {
	// Lấy ID của theater từ URL parameter
	theaterID := c.Param("id")

	var theater models.Theater

	// Tìm theater trong cơ sở dữ liệu bằng ID
	if err := database.DB.Where("theater_id = ?", theaterID).First(&theater).Error; err != nil {
		// Nếu không tìm thấy theater, trả về lỗi 404
		c.JSON(http.StatusNotFound, gin.H{"error": "Theater not found"})
		return
	}

	// Nếu tìm thấy, trả về thông tin theater
	c.JSON(http.StatusOK, gin.H{"data": theater})
}
