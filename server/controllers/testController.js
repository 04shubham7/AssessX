const { z } = require('zod');
const Test = require('../models/Test');

const testSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    duration: z.number().min(1, { message: 'Duration must be at least 1 minute' }),
    settings: z.object({
        negativeMarking: z.boolean().optional(),
        shuffleQuestions: z.boolean().optional()
    }).optional(),
    questions: z.array(z.object({
        questionText: z.string().min(1, { message: 'Question text is required' }),
        type: z.enum(['single', 'multiple', 'subjective']),
        marks: z.number().positive(),
        allowFileUpload: z.boolean().optional(),
        options: z.array(z.object({
            text: z.string(),
            isCorrect: z.boolean()
        })).optional()
    })).min(1, { message: 'At least one question is required' })
});

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private (Admin)
const createTest = async (req, res) => {
    try {
        const validatedData = testSchema.parse(req.body);
        const { title, questions, duration, settings } = validatedData;

        // Generate a unique 6-digit test code
        let testCode;
        let isUnique = false;
        while (!isUnique) {
            testCode = Math.floor(100000 + Math.random() * 900000).toString();
            const existingTest = await Test.findOne({ testCode });
            if (!existingTest) isUnique = true;
        }

        const test = await Test.create({
            title,
            testCode,
            questions,
            duration,
            settings,
            createdBy: req.admin.id
        });

        res.status(201).json(test);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error creating test' });
    }
};

// @desc    Get all tests for logged in admin
// @route   GET /api/tests
// @access  Private (Admin)
const getTests = async (req, res) => {
    try {
        const tests = await Test.find({ createdBy: req.admin.id }).sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tests' });
    }
};

// @desc    Get single test by ID (For Admin editing/viewing)
// @route   GET /api/tests/:id
// @access  Private (Admin)
const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test not found' });

        if (test.createdBy.toString() !== req.admin.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get test by code (For Student joining)
// @route   GET /api/tests/code/:testCode
// @access  Public
const getTestByCode = async (req, res) => {
    try {
        // Exclude correct answers when sending to student (security)
        // Actually for 'joining' we just need basic info. 
        // The questions might be sent later via socket or a secure 'start' endpoint.
        // For now, let's return basic info + questions (but strip correct flags if valid).

        const test = await Test.findOne({ testCode: req.params.testCode })
            .select('-questions.options.isCorrect');

        if (!test) return res.status(404).json({ message: 'Invalid Test Code' });

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private
const deleteTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check ownership
        if (test.createdBy.toString() !== req.admin.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await test.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createTest,
    getTests,
    getTestById,
    getTestByCode,
    deleteTest
};

