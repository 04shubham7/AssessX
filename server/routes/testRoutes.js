const express = require('express');
const router = express.Router();
const { createTest, getTests, getTestById, getTestByCode } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTest)
    .get(protect, getTests);

router.get('/:id', protect, getTestById);
router.get('/code/:testCode', getTestByCode);

module.exports = router;
