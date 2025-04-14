package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetOrdersOfAccount(c *gin.Context) {
	// Lấy AccountID từ URL
	accountID := c.Param("AccountID")

	// Kiểm tra AccountID có được cung cấp không
	if accountID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AccountID is required"})
		return
	}

	// Truy vấn danh sách orders và preload danh sách order_foods
	var orders []models.Order
	if err := database.DB.Where("AccountID = ?", accountID).
		Preload("OrderFoods"). // Load thêm danh sách order_foods
		Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
		return
	}

	// Trả về danh sách orders cùng với order_foods
	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

// func GetOrdersOfAccount(c *gin.Context) {
// 	// Get the AccountID from the URL parameter
// 	accountID := c.Param("AccountID")

// 	// Check if AccountID is provided
// 	if accountID == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "AccountID is required"})
// 		return
// 	}

// 	// Query the database for orders associated with the given AccountID
// 	var orders []models.Order
// 	if err := database.DB.Where("AccountID = ?", accountID).Find(&orders).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
// 		return
// 	}

// 	// Return the retrieved orders
// 	c.JSON(http.StatusOK, gin.H{"orders": orders})
// }

func AddOrder(c *gin.Context) {
	var order models.Order

	// Bind JSON request to Order struct
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set CreatedAt timestamp
	order.CreatedAt = time.Now()

	// Save to database
	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "orderID": order.OrderID})
}
