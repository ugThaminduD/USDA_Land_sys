const express = require('express');
const { createLand, getAllLands, getLandById, updateLand, deleteLand } = require('../controllers/landController');
// const { sendReminders } = require('../services/notificationService');
// const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload images only.'), false);
        }
    }
});


const router = express.Router();

router.post('/add', createLand);
router.get('/getALL/lands', getAllLands);
router.get('/get/land/:id', getLandById);

router.put('/update/land/:id', updateLand);
router.delete('/delete/land/:id', deleteLand);


router.post('/upload/images', upload.array('images', 5), (req, res) => { // Allow up to 5 images
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ imageUrls });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
