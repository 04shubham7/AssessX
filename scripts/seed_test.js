const mongoose = require('mongoose');
const Test = require('../server/models/Test');
require('dotenv').config({ path: '../server/.env' });

const seedTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assessx');
        console.log('Connected to MongoDB');

        const testTitle = "Subjective Verify";
        let test = await Test.findOne({ title: testTitle });

        if (!test) {
            console.log('Creating new test...');
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            test = await Test.create({
                title: testTitle,
                testCode: code,
                duration: 15,
                questions: [
                    {
                        questionText: "Please upload your handwritten solution for: Integral of e^x.",
                        type: "subjective",
                        allowFileUpload: true,
                        marks: 5,
                        options: [], // Subjective has no options
                    }
                ],
                isActive: true
            });
            console.log(`Test Created. Code: ${test.testCode}`);
        } else {
            console.log(`Test Exists. Code: ${test.testCode}`);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding test:', error);
        process.exit(1);
    }
};

seedTest();
