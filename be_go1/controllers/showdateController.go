package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddShowDate(c *gin.Context) {
	var showdate models.ShowDate

	if err := c.ShouldBindJSON(&showdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&showdate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create showtime"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": showdate})
}

func GetShowDate(c *gin.Context) {
	var showdates []models.ShowDate

	if err := database.DB.Where("Status = ?", 1).Find(&showdates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch show dates"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": showdates})
}
