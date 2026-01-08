const express = require('express');
const router = express.Router();
const { createTest, getTests, getTestById, getTestByCode, deleteTest } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTest)
    .get(protect, getTests);

router.get('/:id', protect, getTestById);
router.delete('/:id', protect, deleteTest);
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Return relative path for frontend access
    res.json({ filePath: `/${req.file.path.replace(/\\/g, '/')}` });
});

router.get('/code/:testCode', getTestByCode);

module.exports = router;
