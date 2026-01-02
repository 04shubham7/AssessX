const Result = require('../models/Result');
const Test = require('../models/Test');

// @desc    Get results for a test
// @route   GET /api/results/:testId
// @access  Private (Admin)
const getResultsByTestId = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        // Authorization check
        if (test.createdBy.toString() !== req.admin.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const results = await Result.find({ testId: req.params.testId })
            .sort({ score: -1, timeTaken: 1 }); // Higher score first, then less time taken

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getResultsByTestId
};
