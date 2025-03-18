const express = require('express');
const { createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
// const { sendReminders } = require('../services/notificationService');
// const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', createUser);
router.post('/login', loginUser);

router.get('/getALL', getAllUsers);
router.get('/get/:id', getUserById);

router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);


module.exports = router;
