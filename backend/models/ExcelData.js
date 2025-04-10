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
            default: "General",
            required: true
        },
        sheetName: {
            type: String,
            default: "Sheet1"
        },
        parentFile: {
            type: String,
            default: null
        },
        uploadDate: {
            type: Date,
            default: Date.now
        },
        excelFileId: {    // Store the GridFS file ID
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        mimeType: {    // Add this field
            type: String,
            required: true
        },
        data: [{}] // Array of objects with flexible schema
    }, 
    { strict: false }
);


const ExcelDataModel = mongoose.model("ExcelData", DataSchema);
module.exports = ExcelDataModel;