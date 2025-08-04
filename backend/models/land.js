const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandSchema = new Schema(
    {
        // Common Location Fields
        Provinces: {
            type: String,
            required: true,
            enum: [
                "Central Province", "Eastern Province", "North Central Province", "Northern Province",
                "North Western Province", "Sabaragamuwa Province", "Southern Province",
                "Uva Province", "Western Province"
            ]
        },
        Districts: {
            type: String,
            required: true,
            enum: [
                "Ampara", "Anuradhapura", "Badulla", "Batticaloa", 
                "Colombo", "Galle", "Gampaha", "Hambantota", 
                "Jaffna", "Kalutara", "Kandy", "Kegalle", 
                "Kilinochchi", "Kurunegala", "Mannar", "Matale", 
                "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", 
                "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", 
                "Vavuniya"
            ]
        },
        Divisional_secretariats: {
            type: String,
            required: true,
        },

        // LAND DETAILS SECTION
        // Land Basic Info
        Land_address: {
            type: String, 
            required: false 
        },
        Land_location: {
            type: String, 
            required: false 
        },
        Land_Area_of_Land: {
            type: String, 
            required: function() {
                return this.formSections && this.formSections.land;
            }
        },
        Land_Area_of_Land_Unit: {
            type: String,
            default: "Hectares",
            enum: ["Hectares", "Perches", "Acres", "Square Feet"]
        },
        Land_description: {
            type: String,
            required: false
        },
        Land_images: [{
            type: String,
            required: false
        }],
        Land_documents: [{  
            type: String,
            required: false
        }],
        Land_current_use: {
            type: String,
            required: false
        },

        // Local Employee Details (Land)
        local_employee_name: {
            type: String,
            required: false
        },
        Land_Grama_Niladhari_Division: {
            type: String,
            required: false
        },
        local_employee_phone_number: {
            type: String,
            required: false,
            match: [/^\d{10}$/, "Phone number must be 10 digits"]
        },
        local_employee_email: {
            type: String,
            required: false,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
        },
        Day_of_Entry: {
            type: Date,
            required: function() {
                return this.formSections && this.formSections.land;
            }
        },

        // Land Ownership Details
        Land_ownership: {
            type: String,
            required: function() {
                return this.formSections && this.formSections.land;
            },
            enum: ["Government", "Private Own"]
        },
        Land_owner_name: {
            type: String,
            required: function() {
                return this.formSections && this.formSections.land;
            }
        },
        Land_owner_address: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
        },
        phone_number: {
            type: String,
            required: false,
            match: [/^\d{10}$/, "Phone number must be 10 digits"]
        },

        // SOCIAL DETAILS SECTION
        Social_Grama_Niladhari_Division: {
            type: String,
            required: false
        },

        // Population Details
        Total_Population: {
            type: Number,
            required: false,
            min: 0
        },
        Total_Families: {
            type: Number,
            required: false,
            min: 0
        },
        Total_Male_Population: {
            type: Number,
            required: false,
            min: 0
        },
        Total_Female_Population: {
            type: Number,
            required: false,
            min: 0
        },

        // Housing Details
        Shanty_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Shanties: {
            type: Number,
            required: false,
            min: 0
        },
        Slum_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Slums: {
            type: Number,
            required: false,
            min: 0
        },
        Line_Room_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Line_Rooms: {
            type: Number,
            required: false,
            min: 0
        },
        Scattered_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Scattered_Housing: {
            type: Number,
            required: false,
            min: 0
        },
        Vulnerable_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Vulnerable_Housing: {
            type: Number,
            required: false,
            min: 0
        },
        Other_Housing_Units: {
            type: Number,
            required: false,
            min: 0
        },
        Families_in_Other_Housing: {
            type: Number,
            required: false,
            min: 0
        },

        // Social Land Details
        Social_Area_of_Land: {
            type: String,
            required: function() {
                return this.formSections && this.formSections.social;
            }
        },
        Social_Area_of_Land_Unit: {
            type: String,
            default: "Hectares",
            enum: ["Hectares", "Perches", "Acres", "Square Feet"]
        },
        Land_Extent: {
            type: String,
            required: false
        },
        Land_Lot_Details: {
            type: String,
            required: false
        },

        // Vulnerability and Livability
        Vulnerability_Index: {
            type: String,
            required: false,
            enum: ["Low", "Moderate", "High", "Critical", ""]
        },
        Livability_Condition: {
            type: String,
            required: false,
            enum: ["Good", "Moderate", "Poor", "Critical", ""]
        },
        Additional_Notes: {
            type: String,
            required: false
        },

        // Social Images and Documents
        Social_images: [{
            type: String,
            required: false
        }],
        Social_documents: [{
            type: String,
            required: false
        }],

        // Form Section Tracking (to know which sections were filled)
        formSections: {
            land: {
                type: Boolean,
                default: false
            },
            social: {
                type: Boolean,
                default: false
            }
        },

        // Legacy fields (keeping for backward compatibility)
        Area_of_Land: {
            type: String,
            required: false
        },
        Grama_Niladhari_divisions: {
            type: String,
            required: false
        },
        USDA_Entry_employee_name: {
            type: String,
            required: false
        },

    },
    { timestamps: true }
);

const LandModel = mongoose.model('lands', LandSchema);
module.exports = LandModel;