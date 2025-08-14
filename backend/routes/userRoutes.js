const express = require('express');
const { createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
// const { sendReminders } = require('../services/notificationService');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);

router.post('/add', protect, createUser); // Only admin can do CRUD operations on users
router.get('/getALL', protect, getAllUsers);
router.get('/get/:id', protect, getUserById);

router.put('/update/:id', protect, updateUser);
router.delete('/delete/:id', protect, deleteUser);



module.exports = router;
