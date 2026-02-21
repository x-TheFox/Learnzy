const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getMe, registerUser, updateProfile } = require('../controllers/userController');

router.get('/me', verifyToken, getMe);
router.post('/register', verifyToken, registerUser);
router.put('/me', verifyToken, updateProfile);

module.exports = router;
