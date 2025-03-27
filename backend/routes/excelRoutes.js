const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadExcel, getData, getFiles, getFileData } = require("../controllers/excelController");


// Multer Setup for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Excel upload route
router.post("/upload/excel_document", upload.single("file"), uploadExcel);

// Get all files metadata
router.get("/excel/files", getFiles);

// Get data for a specific file
router.get("/excel/file/:id", getFileData);

// Get all data route (backward compatibility)
router.get("/data", getData);


module.exports = router;