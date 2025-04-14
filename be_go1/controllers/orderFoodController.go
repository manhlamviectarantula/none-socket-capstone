package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// func AddOrderFood(c *gin.Context) {
// 	var order models.OrderFood

// 	// Bind JSON request to Order struct
// 	if err := c.ShouldBindJSON(&order); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Save to database
// 	if err := database.DB.Create(&order).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{"message": "Order created successfully", "order": order})
// }

// func AddOrderFood(c *gin.Context) {
// 	var orderFood models.OrderFood

// 	// Lấy AccountID từ URL
// 	accountID := c.Param("AccountID")

// 	// Kiểm tra AccountID hợp lệ
// 	if accountID == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "AccountID is required"})
// 		return
// 	}

// 	// Tìm OrderID gần nhất của AccountID
// 	var order models.Order
// 	if err := database.DB.Where("AccountID = ?", accountID).Order("OrderID DESC").First(&order).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "No order found for this account"})
// 		return
// 	}

// 	// Bind JSON request vào struct OrderFood
// 	if err := c.ShouldBindJSON(&orderFood); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Gán OrderID tìm được vào OrderFood
// 	orderFood.OrderID = order.OrderID

// 	// Thêm OrderFood vào database
// 	if err := database.DB.Create(&orderFood).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order food"})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{
// 		"message":   "Order food created successfully",
// 		"orderFood": orderFood,
// 	})
// }

func AddOrderFood(c *gin.Context) {
	var orderFood models.OrderFood

	orderIDStr := c.Param("OrderID")
	if orderIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OrderID is required"})
		return
	}

	// Chuyển string -> int
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OrderID format"})
		return
	}

	// Parse JSON
	if err := c.ShouldBindJSON(&orderFood); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Gán OrderID đúng kiểu int
	orderFood.OrderID = orderID

	// Lưu vào DB
	if err := database.DB.Create(&orderFood).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order food"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Order food created successfully",
		"orderFood": orderFood,
	})
}
