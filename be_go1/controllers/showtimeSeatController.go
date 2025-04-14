package controllers

import (
	"movie-ticket-booking/database"
	"movie-ticket-booking/models"
	"net/http"
	"sort"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UpdateShowtimeSeatStatus(c *gin.Context) {
	// Define a struct to receive the list of ShowtimeSeatIDs
	var request struct {
		ShowtimeSeatIDs []int `json:"ShowtimeSeatIDs" binding:"required"`
	}

	// Bind request body to request struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Loop over the list of ShowtimeSeatIDs and update each seat's status
	for _, seatID := range request.ShowtimeSeatIDs {
		var seat models.ShowtimeSeat
		// Find the ShowtimeSeat by its ID
		if err := database.DB.First(&seat, seatID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Showtime seat with ID " + strconv.Itoa(seatID) + " not found"})
			return
		}

		// Update the seat status to 1 (true)
		seat.Status = true
		if err := database.DB.Save(&seat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status for seat ID " + strconv.Itoa(seatID)})
			return
		}
	}

	// Respond with success message after all updates
	c.JSON(http.StatusOK, gin.H{"message": "Showtime seats statuses updated successfully"})
}

func GetShowtimeSeat(c *gin.Context) {
	showtimeID := c.Query("ShowtimeID")
	if showtimeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing showtimeID"})
		return
	}

	type SeatData struct {
		ShowtimeSeatID int     `json:"ShowtimeSeatID"`
		SeatNumber     int     `json:"SeatNumber"`
		Area           int     `json:"Area"`
		Column         int     `json:"Column"`
		Row            int     `json:"Row"`
		RowName        string  `json:"RowName"`
		Status         bool    `json:"Status"`
		TicketPrice    float64 `json:"TicketPrice"`
		Description    string  `json:"Description"`
	}

	type RowData struct {
		Index int        `json:"index"`
		Name  string     `json:"name"`
		Seats []SeatData `json:"seats"`
	}

	var seatData []struct {
		ShowtimeSeatID int     `json:"ShowtimeSeatID"`
		RowName        string  `json:"RowName"`
		RowID          int     `json:"RowID"`
		SeatNumber     int     `json:"SeatNumber"`
		Area           int     `json:"Area"`
		Column         int     `json:"Column"`
		Row            int     `json:"Row"`
		Status         bool    `json:"Status"`
		TicketPrice    float64 `json:"TicketPrice"`
		Description    string  `json:"Description"`
	}

	err := database.DB.Raw(`
		SELECT
			r.RowName,
			r.RowID,
			s.SeatNumber,
			s.Area,
			s.Column,
			s.Row,
			ss.Status,
			ss.TicketPrice,
			s.Description,
			ss.ShowtimeSeatID
		FROM
			showtime_seats ss
		JOIN
			seats s ON ss.SeatID = s.SeatID
		JOIN
			`+"`rows`"+` r ON s.RowID = r.RowID
		WHERE
			ss.ShowtimeID = ?
		ORDER BY
			r.RowName DESC, s.Column ASC
	`, showtimeID).Scan(&seatData).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	maxRow := 0
	maxColumn := 0
	rowIndexMap := make(map[string]int)
	rowNames := []string{}

	// **Ghi nhận RowName theo thứ tự xuất hiện và tính maxRow**
	for _, seat := range seatData {
		if _, exists := rowIndexMap[seat.RowName]; !exists {
			rowNames = append(rowNames, seat.RowName)
			rowIndexMap[seat.RowName] = len(rowNames) - 1 // Gán index theo thứ tự xuất hiện
		}
		if seat.Row > maxRow {
			maxRow = seat.Row
		}
		if seat.Column > maxColumn {
			maxColumn = seat.Column
		}
	}

	rowMap := make(map[string]*RowData)

	// **Tạo RowData theo thứ tự đã ghi nhận**
	for _, seat := range seatData {
		if _, exists := rowMap[seat.RowName]; !exists {
			rowMap[seat.RowName] = &RowData{
				Index: rowIndexMap[seat.RowName],
				Name:  seat.RowName,
				Seats: []SeatData{},
			}
		}
		rowMap[seat.RowName].Seats = append(rowMap[seat.RowName].Seats, SeatData{
			ShowtimeSeatID: seat.ShowtimeSeatID,
			SeatNumber:     seat.SeatNumber,
			Area:           seat.Area,
			Column:         seat.Column,
			Row:            seat.Row,
			RowName:        seat.RowName,
			Status:         seat.Status,
			TicketPrice:    seat.TicketPrice,
			Description:    seat.Description,
		})
	}

	// **Chuyển map thành danh sách và sắp xếp theo Index**
	rows := make([]RowData, 0, len(rowMap))
	for _, row := range rowMap {
		rows = append(rows, *row)
	}

	sort.SliceStable(rows, func(i, j int) bool {
		return rows[i].Index < rows[j].Index
	})

	result := gin.H{
		"maxColumn": maxColumn + 1, // Cộng thêm 1 để phản ánh index chính xác
		"maxRow":    maxRow,
		"rows":      rows,
	}

	c.JSON(http.StatusOK, result)
}

func AddShowtimeSeats(c *gin.Context) {
	showtimeID := c.Param("ShowtimeID")
	theaterID := c.Param("TheaterID")

	if showtimeID == "" || theaterID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ShowtimeID or TheaterID"})
		return
	}

	// Chạy truy vấn INSERT
	query := `
		INSERT INTO showtime_seats (ShowtimeID, SeatID, RowName, Status, TicketPrice)
		SELECT ?, s.SeatID, r.RowName, 0, 50000
		FROM seats s
		JOIN ` + "`rows`" + ` r ON s.RowID = r.RowID
		WHERE r.TheaterID = ?;
	`

	if err := database.DB.Exec(query, showtimeID, theaterID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Showtime seats added successfully"})
}

func DeleteShowtimeSeats(c *gin.Context) {
	// Lấy ShowtimeID từ param
	showtimeID := c.Param("ShowtimeID")

	// Chuyển ShowtimeID sang kiểu số nguyên
	id, err := strconv.Atoi(showtimeID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ShowtimeID"})
		return
	}

	// Khai báo biến theo kiểu models.ShowtimeSeat
	var showtimeSeats []models.ShowtimeSeat

	// Kiểm tra xem có ghế nào thuộc suất chiếu không
	if err := database.DB.Where("ShowtimeID = ?", id).Find(&showtimeSeats).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No seats found for this ShowtimeID"})
		return
	}

	// Xóa tất cả các ghế có ShowtimeID tương ứng
	result := database.DB.Where("ShowtimeID = ?", id).Delete(&models.ShowtimeSeat{})

	// Nếu không có ghế nào bị xóa
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No seats were deleted"})
		return
	}

	// Phản hồi khi xóa thành công
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully", "deleted_rows": result.RowsAffected})
}

// func GetShowtimeSeat(c *gin.Context) {
// 	// Lấy ShowtimeID từ query string
// 	showtimeID := c.Query("showtimeID")
// 	if showtimeID == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing showtimeID"})
// 		return
// 	}

// 	// Struct để lưu kết quả truy vấn từ database
// 	type SeatData struct {
// 		SeatNumber  int     `json:"SeatNumber"`
// 		Area        int     `json:"Area"`
// 		Column      int     `json:"Column"`
// 		Row         int     `json:"Row"`
// 		Status      bool    `json:"Status"`
// 		TicketPrice float64 `json:"TicketPrice"`
// 		Description string  `json:"Description"`
// 	}

// 	type RowData struct {
// 		Index int        `json:"index"`
// 		Name  string     `json:"name"`
// 		Seats []SeatData `json:"seats"`
// 	}

// 	// Kết quả tổng hợp
// 	var seatData []struct {
// 		RowName     string  `json:"RowName"`
// 		RowID       int     `json:"RowID"`
// 		SeatNumber  int     `json:"SeatNumber"`
// 		Area        int     `json:"Area"`
// 		Column      int     `json:"Column"`
// 		Row         int     `json:"Row"`
// 		Status      bool    `json:"Status"`
// 		TicketPrice float64 `json:"TicketPrice"`
// 		Description string  `json:"Description"`
// 	}

// 	// Truy vấn database để lấy dữ liệu ghế
// 	err := database.DB.Raw(`
// 		SELECT
// 			r.RowName,
// 			r.RowID,
// 			s.SeatNumber,
// 			s.Area,
// 			s.Column,
// 			s.Row,
// 			ss.Status,
// 			ss.TicketPrice,
// 			s.Description
// 		FROM
// 			showtime_seats ss
// 		JOIN
// 			seats s ON ss.SeatID = s.SeatID
// 		JOIN
// 			`+"`rows`"+` r ON s.RowID = r.RowID
// 		WHERE
// 			ss.ShowtimeID = ?
// 		ORDER BY
// 			r.RowID DESC, s.Column ASC
// 	`, showtimeID).Scan(&seatData).Error

// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Xử lý dữ liệu
// 	maxRow := 0
// 	maxColumn := 0
// 	rowMap := make(map[string]*RowData) // Nhóm theo RowName
// 	rowIndexMap := make(map[string]int) // Lưu chỉ mục của mỗi RowName

// 	indexCounter := 0 // Biến đếm cho row index

// 	for _, seat := range seatData {
// 		// Cập nhật maxRow và maxColumn
// 		if seat.RowID > maxRow {
// 			maxRow = seat.RowID
// 		}
// 		if seat.Column > maxColumn {
// 			maxColumn = seat.Column
// 		}

// 		// Nếu RowName chưa tồn tại trong rowMap, thêm vào
// 		if _, exists := rowMap[seat.RowName]; !exists {
// 			rowIndexMap[seat.RowName] = indexCounter
// 			rowMap[seat.RowName] = &RowData{
// 				Index: indexCounter,
// 				Name:  seat.RowName,
// 				Seats: []SeatData{},
// 			}
// 			indexCounter++
// 		}

// 		// Thêm ghế vào hàng tương ứng
// 		row := rowMap[seat.RowName]
// 		row.Seats = append(row.Seats, SeatData{
// 			SeatNumber:  seat.SeatNumber,
// 			Area:        seat.Area,
// 			Column:      seat.Column,
// 			Row:         seat.Row,
// 			Status:      seat.Status,
// 			TicketPrice: seat.TicketPrice,
// 			Description: seat.Description,
// 		})
// 	}

// 	// Chuyển dữ liệu nhóm thành danh sách
// 	rows := make([]RowData, 0, len(rowMap))
// 	for _, row := range rowMap {
// 		rows = append(rows, *row)
// 	}

// 	// Định dạng JSON kết quả
// 	result := gin.H{
// 		"maxColumn": maxColumn + 1, // Cộng thêm 1 để phản ánh index chính xác
// 		"maxRow":    maxRow,
// 		"rows":      rows,
// 	}

// 	// Trả về JSON
// 	c.JSON(http.StatusOK, result)
// }
