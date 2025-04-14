package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// AddBranch handles creating a new branch
func AddBranch(c *gin.Context) {
	var branch models.Branch

	// Bind incoming JSON to the Branch struct
	if err := c.ShouldBindJSON(&branch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set timestamps
	branch.CreatedAt = time.Now()
	branch.LastModified = time.Now()

	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the new branch to the database
	if err := database.DB.Create(&branch).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create branch"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": branch})
}

// UpdateBranch handles updating an existing branch
func UpdateBranch(c *gin.Context) {
	var branch models.Branch

	// Get BranchID from URL parameters
	BranchID := c.Param("id")

	// Find the branch by ID
	if err := database.DB.First(&branch, BranchID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Branch not found"})
		return
	}

	// Bind incoming JSON to the Branch struct
	if err := c.ShouldBindJSON(&branch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update LastModified timestamp
	branch.LastModified = time.Now()

	// Save changes to the database
	if err := database.DB.Save(&branch).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update branch"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"data": branch})
}
