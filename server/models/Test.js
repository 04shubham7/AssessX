const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: {
        type: String, // 'single', 'multiple', 'subjective'
        default: 'single'
    },
    questionText: {
        type: String,
        required: true
    },
    image: {
        type: String // URL or base64
    },
    options: [{
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false }
    }],
    allowFileUpload: {
        type: Boolean,
        default: false
    },
    marks: {
        type: Number,
        default: 1
    }
});

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    testCode: {
        type: String,
        required: true,
        unique: true
    },
    questions: [questionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    settings: {
        negativeMarking: { type: Boolean, default: false },
        shuffleQuestions: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
