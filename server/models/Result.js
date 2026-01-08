const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: String // Format like "4:30" or seconds
    },
    violationCount: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        type: String, // 'single', 'multiple', 'subjective'
        response: mongoose.Schema.Types.Mixed, // Option ID(s) or File Path/Text
        isCorrect: Boolean,
        marksAwarded: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
