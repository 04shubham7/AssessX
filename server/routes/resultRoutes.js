const express = require('express');
const router = express.Router();
const { getResultsByTestId } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:testId', protect, getResultsByTestId);

module.exports = router;
