const express = require('express');
const { createLand, getAllLands, getLandById, updateLand, deleteLand } = require('../controllers/landController');
// const { sendReminders } = require('../services/notificationService');
// const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');


// Add image storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
// Configure multer for images
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB limit per file   
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload images only.'), false);
        }
    }
});


// Add document storage configuration
const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/documents/') // Create this directory on your server
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
});
// Configure multer for documents
const uploadDocuments = multer({ 
      storage: documentStorage,
      limits: {
          fileSize: 1000 * 1024 * 1024 // 1000MB limit per file
      },
      fileFilter: (req, file, cb) => {
          const allowedTypes = [
              'application/pdf', 
              'application/msword', 
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'text/plain'
          ];
          
          if (allowedTypes.includes(file.mimetype)) {
              cb(null, true);
          } else {
              cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed.'), false);
          }
      }
});



const router = express.Router();

router.post('/add', createLand);
router.get('/getALL/lands', getAllLands);
router.get('/get/land/:id', getLandById);

router.put('/update/land/:id', updateLand);
router.delete('/delete/land/:id', deleteLand);


// Upload images
router.post('/upload/images', upload.array('images', 5), (req, res) => { // Allow up to 5 images
    try {
        console.log('Images received:', req.files); // Add logging
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const imageUrls = req.files.map(file => `/uploads/images/${file.filename}`);
        res.json({ imageUrls });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload documents
router.post('/upload/documents', uploadDocuments.array('documents', 5), (req, res) => { // Allow up to 5 documents
    try {
        console.log('Documents received:', req.files); // Add logging
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const documentUrls = req.files.map(file => `/uploads/documents/${file.filename}`);
        res.json({ documentUrls });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
