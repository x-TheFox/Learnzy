const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getMyProgress, getStats } = require('../controllers/progressController');

router.get('/', verifyToken, getMyProgress);
router.get('/stats', verifyToken, getStats);

module.exports = router;
