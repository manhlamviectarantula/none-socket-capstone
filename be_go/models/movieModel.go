// package models

// import "time"

// type Movie struct {
// 	MovieID        int        `json:"movie_id" gorm:"primaryKey"` // Movie ID (PK)
// 	MovieName      string     `json:"movie_name"`                 // Movie Name
// 	Slug           string     `json:"slug"`                       // Identifier
// 	AgeTag         string     `json:"age_tag"`                    // Age Rating
// 	Duration       int        `json:"duration"`                   // Duration (in minutes)
// 	ReleaseDate    *time.Time `json:"release_date"`               // Release Date
// 	LastScreenDate *time.Time `json:"last_screen_date"`           // Last Screening Date
// 	Poster         string     `json:"poster"`                     // Movie Poster Image URL
// 	Trailer        string     `json:"trailer"`                    // Trailer URL
// 	Rating         float64    `json:"rating"`                     // Rating
// 	Description    string     `json:"description"`                // Movie Description
// 	Status         int        `json:"status"`                     // Status (e.g., Active, Inactive)
// 	CreatedAt      time.Time  `json:"created_at"`                 // Creation Date
// 	CreatedBy      string     `json:"created_by"`                 // Created By
// 	LastModified   time.Time  `json:"last_modified"`              // Last Modified Date
// 	LastModifiedBy string     `json:"last_modified_by"`           // Last Modified By
// }

package models

import (
	"time"
)

type Movie struct {
	MovieID        int        `form:"movie_id" gorm:"primaryKey"`
	MovieName      string     `form:"movie_name"`
	Slug           string     `form:"slug"`
	AgeTag         string     `form:"age_tag"`
	Duration       int        `form:"duration"`
	ReleaseDate    *time.Time `form:"release_date"`
	LastScreenDate *time.Time `form:"last_screen_date"`
	Poster         string     `form:"poster"`
	Trailer        string     `form:"trailer"`
	Rating         float64    `form:"rating"`
	Description    string     `form:"description"` // Will hold the unparsed JSON description
	Status         int        `form:"status"`
	CreatedAt      time.Time  `form:"created_at"`
	CreatedBy      string     `form:"created_by"`
	LastModified   time.Time  `form:"last_modified"`
	LastModifiedBy string     `form:"last_modified_by"`
}
