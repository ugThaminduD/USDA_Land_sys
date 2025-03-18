const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
    {
        // employee_number: {
        //     type: Number,
        //     required: true,
        //     unique: true
        // },
        employee_name: {
            type: String,
            required: true
        },
        employee_id_number: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true  
        },
        phone_number: {
            type: Number
        },
        employee_password: {
            type: String,
            required: true,
            unique: true
        },
        role: {  
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },


        department: {
            type: String,
            required: true
        },
        position: {
            type: String
        },
        
    },
    { timestamps: true }
);

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;