const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { simplifyText, getQuizHint, focusCheck } = require('../controllers/aiController');

router.post('/simplify', verifyToken, simplifyText);
router.post('/quiz-hint', verifyToken, getQuizHint);
router.post('/focus-check', verifyToken, focusCheck);

module.exports = router;
