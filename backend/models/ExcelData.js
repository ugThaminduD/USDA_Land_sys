const mongoose = require("mongoose");

// Define Schema - flexible schema to accommodate various Excel structures
// const DataSchema = new mongoose.Schema({}, { strict: false });


const DataSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },
        topic: {
            type: String,
            default: "General"
        },
        uploadDate: {
            type: Date,
            default: Date.now
        },
        data: [{}] // Array of objects with flexible schema
    }, 
    { strict: false }
);


const ExcelDataModel = mongoose.model("ExcelData", DataSchema);
module.exports = ExcelDataModel;