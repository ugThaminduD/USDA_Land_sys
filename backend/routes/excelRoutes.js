const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadExcel, getData, getFiles, getFileData, downloadExcel } = require("../controllers/excelController");


// Multer Setup for File Uploads
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 1 // Only allow 1 file per request
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (
            file.originalname.match(/\.(xlsx|xls)$/i) && 
            (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
             file.mimetype === 'application/vnd.ms-excel')
        ) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed.'));
        }
    }
});


// Excel upload route with error handling
router.post("/upload/excel_document", (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error (e.g., file too large)
            return res.status(400).json({
                success: false,
                message: err.code === 'LIMIT_FILE_SIZE' 
                    ? 'File size too large. Maximum size allowed is 100MB'
                    : err.message
            });
        } else if (err) {
            // Other errors
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        // If no error, proceed to controller
        next();
    });
}, uploadExcel);

// Get all files metadata
router.get("/excel/files", getFiles);

// Get data for a specific file
router.get("/excel/file/:id", getFileData);

// Get all data route (backward compatibility)
router.get("/data", getData);

// Download Excel file
router.get("/excel/download/:id", downloadExcel);

module.exports = router;