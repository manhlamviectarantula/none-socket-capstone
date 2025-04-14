package models

import "time"

type Branch struct {
	BranchID       int       `json:"branch_id" gorm:"primaryKey"` // Branch Code (PK)
	BranchName     string    `json:"branch_name"`                 // Branch Name
	Slug           string    `json:"slug"`                        // Identifier
	Email          string    `json:"email"`                       // Email
	Address        string    `json:"address"`                     // Address
	PhoneNumber    string    `json:"phone_number"`                // Phone Number
	ImageURL       string    `json:"image_url"`                   // Image URL
	City           string    `json:"city"`                        // City
	CreatedAt      time.Time `json:"created_at"`                  // Creation Date
	CreatedBy      string    `json:"created_by"`                  // Created By
	LastModified   time.Time `json:"last_modified"`               // Last Modified Date
	LastModifiedBy string    `json:"last_modified_by"`            // Last Modified By
}
