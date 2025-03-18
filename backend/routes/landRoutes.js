const express = require('express');
const { createLand, getAllLands, getLandById, updateLand, deleteLand } = require('../controllers/landController');
// const { sendReminders } = require('../services/notificationService');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', createLand);
router.get('/getALL', getAllLands);
router.get('/get/:id', getLandById);

router.put('/update/:id', updateLand);
router.delete('/delete/:id', deleteLand);


module.exports = router;
