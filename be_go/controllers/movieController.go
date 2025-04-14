package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllMovies(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"movies": "List of movies"})
}

func AddMovie(c *gin.Context) {
	var movie models.Movie

	// Bind the non-file form fields to the Movie struct
	if err := c.ShouldBind(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Handle file upload for the Poster field
	file, err := c.FormFile("poster")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Poster file is required"})
		return
	}

	// Save the uploaded file to the server
	if err := c.SaveUploadedFile(file, "uploads/posters/"+file.Filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
		return
	}

	// // Save the uploaded file to the server
	// if err := c.SaveUploadedFile(movie.Poster, "uploads/posters/"+movie.Poster.Filename); err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
	// 	return
	// }

	// Check if ReleaseDate is nil and set the current time if it is
	if movie.ReleaseDate == nil || movie.ReleaseDate.IsZero() {
		now := time.Now()
		movie.ReleaseDate = &now
	}

	// Check if LastScreenDate is nil and set the current time if it is
	if movie.LastScreenDate == nil || movie.LastScreenDate.IsZero() {
		now := time.Now()
		movie.LastScreenDate = &now
	}

	// Set the creation and modification timestamps
	movie.CreatedAt = time.Now()
	movie.LastModified = time.Now()

	// Save the movie to the database (example)
	if err := database.DB.Create(&movie).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create movie"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{"data": movie})
}

func UpdateMovie(c *gin.Context) {
	var movie models.Movie
	id := c.Param("id")

	// Find the movie by ID
	if err := database.DB.First(&movie, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	// Bind incoming JSON to the movie struct
	if err := c.ShouldBindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the LastModified timestamp
	movie.LastModified = time.Now()

	if err := database.DisableForeignKeyChecks(database.DB, c); err != nil {
		return
	}

	// Save the updated movie to the database
	if err := database.DB.Save(&movie).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update movie"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"data": movie})
}
