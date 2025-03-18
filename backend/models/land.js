const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LandSchema = new Schema(
    {
        //location
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
        Grama_Niladhari_divisions: {
            type: String,
            required: true
        },


        // land details
        Land_address: {
            type: String, 
            required:false 
        },
        Land_location: { // if there isn't a address
            type: String, 
            required:true 
        },
        Area_of_Land: {
            type: String, 
            required:true 
        },
        Land_image: {
            type: String
        },
        Land_description: {
            type: String,
            required: true,
        },

        local_employee_name: {  // local agent(Grama_Niladhari) in land location
            type: String,
            required: true
        },
        local_employee_phone_number: {
            type: String,
            required: true
        },


        USDA_Entry_employee_name: {
            type: String,
            required: true
        },
        Day_of_Entry: {
            type: Date,
            required: true
        },
        
        // Land owner details (if there is a owner to land)
        Land_owner_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true   
        },
        phone_number: {
            type: String,
            required: true
        },
    
    },
    { timestamps: true }
);

const LandModel = mongoose.model('lands', LandSchema);
module.exports = LandModel;