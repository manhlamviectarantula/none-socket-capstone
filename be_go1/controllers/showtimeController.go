package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllShowtimesOfMovie(c *gin.Context) {
	// Lấy movie ID từ tham số URL
	movieID := c.Param("movieid")

	// Khai báo struct để nhận dữ liệu từ truy vấn
	type ShowtimeResponse struct {
		ShowtimeID  int
		MovieID     int
		ShowDate    string
		StartTime   string
		EndTime     string
		Status      string
		TheaterID   int
		TheaterName string
		BranchName  string
		Poster      string
		MovieName   string
	}

	var showtimes []ShowtimeResponse

	// Thực hiện truy vấn
	err := database.DB.Raw(`
		SELECT 
			s.ShowtimeID,
			s.MovieID,
			s.ShowDate,
			s.StartTime,
			s.EndTime,
			s.Status,
			t.TheaterID,
			t.TheaterName,
			b.BranchName,
			m.MovieName,
			m.Poster
		FROM showtimes s
		JOIN theaters t ON s.TheaterID = t.TheaterID
		JOIN branches b ON t.BranchID = b.BranchID
		JOIN movies m ON s.MovieID = m.MovieID 
		WHERE s.MovieID = ?`, movieID).Scan(&showtimes).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve showtimes"})
		return
	}

	// Kiểm tra nếu không có dữ liệu
	if len(showtimes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No showtimes found for this movie"})
		return
	}

	// Trả về danh sách showtime
	c.JSON(http.StatusOK, gin.H{"data": showtimes})
}

func GetShowtimeInfo(c *gin.Context) {
	// Lấy movie ID từ tham số URL
	showtimeid := c.Param("ShowtimeID")

	// Khai báo struct để nhận dữ liệu từ truy vấn
	type ShowtimeResponse struct {
		ShowtimeID  int
		MovieName   string
		Poster      string
		Duration    int
		BranchID    int
		BranchName  string
		TheaterName string
		StartTime   string
		ShowDate    string
	}

	var showtimes []ShowtimeResponse

	// Thực hiện truy vấn
	err := database.DB.Raw(`
		SELECT 
    		s.ShowtimeID,
    		m.MovieName,
    		m.Poster,
    		m.Duration,
			b.BranchID,
    		b.BranchName,
    		t.TheaterName,
    		s.StartTime,
    		s.ShowDate
		FROM showtimes s
		JOIN theaters t ON s.TheaterID = t.TheaterID
		JOIN branches b ON t.BranchID = b.BranchID
		JOIN movies m ON s.MovieID = m.MovieID 
		WHERE s.ShowtimeID = ?`, showtimeid).Scan(&showtimes).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve showtimes"})
		return
	}

	// Kiểm tra nếu không có dữ liệu
	if len(showtimes) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No showtimes found for this movie"})
		return
	}

	// Trả về danh sách showtime
	c.JSON(http.StatusOK, gin.H{"data": showtimes})
}

func GetAllShowtimesOfBranch(c *gin.Context) {
	// Lấy BranchID từ tham số URL
	branchID := c.Param("BranchID")
	showDate := c.Query("ShowDate") // Lấy giá trị ShowDate từ query parameter

	// Khai báo struct để nhận dữ liệu từ truy vấn
	type ShowtimeResponse struct {
		ShowtimeID  int
		Poster      string
		TheaterID   int
		TheaterName string
		StartTime   string
		EndTime     string
		ShowDate    string
	}

	var showtimes []ShowtimeResponse

	// Xây dựng câu truy vấn SQL
	query := `
		SELECT 
			s.ShowtimeID,
			m.Poster,
			t.TheaterID,
			t.TheaterName,
			s.StartTime,
			s.EndTime,
			s.ShowDate
		FROM showtimes s
		JOIN theaters t ON s.TheaterID = t.TheaterID
		JOIN branches b ON t.BranchID = b.BranchID
		JOIN movies m ON s.MovieID = m.MovieID
		WHERE b.BranchID = ?`

	// Nếu có ShowDate, thêm điều kiện lọc theo ngày
	var params []interface{}
	params = append(params, branchID)
	if showDate != "" {
		query += " AND s.ShowDate = ?"
		params = append(params, showDate)
	}

	// Thực hiện truy vấn
	err := database.DB.Raw(query, params...).Scan(&showtimes).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve showtimes"})
		return
	}

	// Kiểm tra nếu không có dữ liệu
	// if len(showtimes) == 0 {
	// 	c.JSON(http.StatusNotFound, gin.H{"message": "No showtimes found for this branch and date"})
	// 	return
	// }

	// Trả về danh sách showtimes
	c.JSON(http.StatusOK, gin.H{"data": showtimes})
}

// chưa query showdate

// func GetAllShowtimesOfBranch(c *gin.Context) {
// 	// Lấy BranchID từ tham số URL
// 	branchID := c.Param("BranchID")

// 	// Khai báo struct để nhận dữ liệu từ truy vấn
// 	type ShowtimeResponse struct {
// 		Poster      string
// 		TheaterID   int
// 		TheaterName string
// 		StartTime   string
// 		ShowDate    string
// 	}

// 	var showtimes []ShowtimeResponse

// 	// Thực hiện truy vấn
// 	err := database.DB.Raw(`
// 		SELECT
// 			m.Poster,
// 			t.TheaterID,
// 			t.TheaterName,
// 			s.StartTime,
// 			s.ShowDate
// 		FROM showtimes s
// 		JOIN theaters t ON s.TheaterID = t.TheaterID
// 		JOIN branches b ON t.BranchID = b.BranchID
// 		JOIN movies m ON s.MovieID = m.MovieID
// 		WHERE b.BranchID = ?`, branchID).Scan(&showtimes).Error
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve showtimes"})
// 		return
// 	}

// 	// Kiểm tra nếu không có dữ liệu
// 	if len(showtimes) == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"message": "No showtimes found for this branch"})
// 		return
// 	}

// 	// Trả về danh sách showtimes
// 	c.JSON(http.StatusOK, gin.H{"data": showtimes})
// }

func AddShowtime(c *gin.Context) {
	// Khai báo struct chỉ chứa các trường cần thiết
	type CreateShowtimeRequest struct {
		TheaterID int    `column:"TheaterID"`
		MovieID   int    `column:"MovieID"`
		ShowDate  string `column:"ShowDate"`
		StartTime string `column:"StartTime"`
		EndTime   string `column:"EndTime"`
		Status    int    `column:"Status"`
		CreatedBy string `column:"CreatedBy"`
	}

	var request CreateShowtimeRequest

	// Bind dữ liệu từ request vào struct (hỗ trợ JSON, form-data, query, v.v.)
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Chuyển dữ liệu từ request sang Showtime
	showtime := models.Showtime{
		TheaterID: request.TheaterID,
		MovieID:   request.MovieID,
		ShowDate:  request.ShowDate,
		StartTime: request.StartTime,
		EndTime:   request.EndTime,
		Status:    request.Status,
		CreatedBy: request.CreatedBy,
	}

	// Lưu vào database
	if err := database.DB.Create(&showtime).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create showtime"})
		return
	}

	// Trả về dữ liệu vừa tạo
	c.JSON(http.StatusCreated, gin.H{"data": showtime})
}

func GetDetailsShowtime(c *gin.Context) {
	var showtime models.Showtime
	showtimeID := c.Param("ShowtimeID") // Lấy ID từ URL

	// Tìm suất chiếu kèm thông tin phim và rạp chiếu
	if err := database.DB.Preload("Movie").Preload("Theater").
		Where("ShowtimeID = ?", showtimeID).
		First(&showtime).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Showtime not found"})
		return
	}

	// Trả về dữ liệu suất chiếu
	c.JSON(http.StatusOK, gin.H{"data": showtime})
}

func DeleteShowtime(c *gin.Context) {
	// Get showtime ID from the URL parameter
	id := c.Param("ShowtimeID")

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
