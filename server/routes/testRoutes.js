const express = require('express');
const router = express.Router();
const { createTest, getTests, getTestById, getTestByCode, deleteTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTest)
    .get(protect, getTests);

router.get('/:id', protect, getTestById);
router.delete('/:id', protect, deleteTest);
router.get('/code/:testCode', getTestByCode);

module.exports = router;
