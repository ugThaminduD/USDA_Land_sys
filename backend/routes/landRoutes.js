const express = require('express');
const { createLand, getAllLands, getLandById, updateLand, deleteLand } = require('../controllers/landController');
// const { sendReminders } = require('../services/notificationService');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', createLand);
router.get('/getALL/lands', getAllLands);
router.get('/get/land/:id', getLandById);

router.put('/update/land/:id', updateLand);
router.delete('/delete/land/:id', deleteLand);


module.exports = router;
