const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getContent,
  getContentById,
  createContent,
  markContentComplete,
} = require('../controllers/contentController');

router.get('/', verifyToken, getContent);
router.get('/:id', verifyToken, getContentById);
router.post('/', verifyToken, createContent);
router.post('/:id/complete', verifyToken, markContentComplete);

module.exports = router;
