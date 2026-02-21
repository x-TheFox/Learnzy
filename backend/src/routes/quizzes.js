const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  submitQuiz,
} = require('../controllers/quizController');

router.get('/', verifyToken, getQuizzes);
router.get('/:id', verifyToken, getQuizById);
router.post('/', verifyToken, createQuiz);
router.post('/:id/submit', verifyToken, submitQuiz);

module.exports = router;
