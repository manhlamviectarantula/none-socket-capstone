package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context) {
	var user models.Account

	// Bind JSON input to user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check for existing email
	var existingUser models.Account
	if err := database.DB.Where("Email = ?", user.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email đã tồn tại"})
		return
	}

	// Check for existing phone number
	var existingPhone models.Account
	if err := database.DB.Where("PhoneNumber= ?", user.PhoneNumber).First(&existingPhone).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Số điện thoại đã tồn tại"})
		return
	}

	// Set default values
	if user.AccountTypeID == 0 {
		user.AccountTypeID = 1 // Default to 1 if not provided
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)

	// Set timestamps
	user.CreatedAt = time.Now()
	user.LastUpdatedAt = time.Now()

	// Save user to database
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng ký thành công",
		"user": gin.H{
			"AccountID":     user.AccountID,
			"AccountTypeID": user.AccountTypeID,
			"BranchID":      user.BranchID,
			"Email":         user.Email,
			"FullName":      user.FullName,
			"PhoneNumber":   user.PhoneNumber,
			"BirthDate":     user.BirthDate,
			"Status":        user.Status,
			"CreatedAt":     user.CreatedAt,
		},
	})
}

var jwtKey = []byte("manh") // Replace with a secure key

// Claims defines the structure for the JWT claims
type Claims struct {
	AccountID int    `json:"account_id"`
	Email     string `json:"email"`
	jwt.RegisteredClaims
}

func LoginUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var user models.Account
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email chưa được đăng ký"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Mật khẩu không đúng"})
		return
	}

	// Lấy thông tin chi nhánh
	var branchName string
	if user.BranchID != nil {
		var branch models.Branch
		if err := database.DB.Select("BranchName").Where("BranchID = ?", *user.BranchID).First(&branch).Error; err == nil {
			branchName = branch.BranchName
		}
	}

	// Generate JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		AccountID: user.AccountID,
		Email:     user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Cấu trúc trả về có thêm BranchName
	type ResponseUser struct {
		AccountID     int       `json:"AccountID"`
		AccountTypeID int       `json:"AccountTypeID"`
		BranchID      *int      `json:"BranchID"`
		BranchName    string    `json:"BranchName,omitempty"`
		Email         string    `json:"Email"`
		PhoneNumber   string    `json:"PhoneNumber"`
		FullName      string    `json:"FullName"`
		BirthDate     string    `json:"BirthDate"`
		Status        bool      `json:"Status"`
		CreatedAt     time.Time `json:"CreatedAt"`
		LastUpdatedAt time.Time `json:"LastUpdatedAt"`
	}

	responseUser := ResponseUser{
		AccountID:     user.AccountID,
		AccountTypeID: user.AccountTypeID,
		BranchID:      user.BranchID,
		BranchName:    branchName,
		Email:         user.Email,
		PhoneNumber:   user.PhoneNumber,
		FullName:      user.FullName,
		BirthDate:     user.BirthDate,
		Status:        user.Status,
		CreatedAt:     user.CreatedAt,
		LastUpdatedAt: user.LastUpdatedAt,
	}

	// Trả về token và thông tin người dùng
	c.JSON(http.StatusOK, gin.H{
		"message": "Đăng nhập thành công",
		"token":   tokenString,
		"user":    responseUser,
	})
}

// func LoginUser(c *gin.Context) {
// 	var input struct {
// 		Email    string `json:"email"`
// 		Password string `json:"password"`
// 	}
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
// 		return
// 	}

// 	var user models.Account
// 	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email hoặc mật khẩu không đúng"})
// 		return
// 	}

// 	// Verify password
// 	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email hoặc mật khẩu không đúng"})
// 		return
// 	}

// 	// Generate JWT token
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		AccountID: user.AccountID,
// 		Email:     user.Email,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
// 		return
// 	}

// 	// Tạo cấu trúc trả về không chứa mật khẩu
// 	type ResponseUser struct {
// 		AccountID     int       `json:"AccountID"`
// 		AccountTypeID int       `json:"AccountTypeID"`
// 		BranchID      *int      `json:"BranchID"`
// 		Email         string    `json:"Email"`
// 		PhoneNumber   string    `json:"PhoneNumber"`
// 		FullName      string    `json:"FullName"`
// 		BirthDate     string    `json:"BirthDate"`
// 		Status        bool      `json:"Status"`
// 		CreatedAt     time.Time `json:"CreatedAt"`
// 		LastUpdatedAt time.Time `json:"LastUpdatedAt"`
// 	}

// 	responseUser := ResponseUser{
// 		AccountID:     user.AccountID,
// 		AccountTypeID: user.AccountTypeID,
// 		BranchID:      user.BranchID,
// 		Email:         user.Email,
// 		PhoneNumber:   user.PhoneNumber,
// 		FullName:      user.FullName,
// 		BirthDate:     user.BirthDate,
// 		Status:        user.Status,
// 		CreatedAt:     user.CreatedAt,
// 		LastUpdatedAt: user.LastUpdatedAt,
// 	}

// 	// Trả về token và thông tin người dùng
// 	c.JSON(http.StatusOK, gin.H{
// 		"message": "Đăng nhập thành công",
// 		"token":   tokenString,
// 		"user":    responseUser,
// 	})
// }

func TMidd(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"movies": "List of movies"})
	c.Next()
}
