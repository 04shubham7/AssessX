const Test = require('../models/Test');
const Result = require('../models/Result');

// Store active lobbies in memory
// { testCode: { students: { socketId: { name, rollNo, ... } }, status: 'waiting' | 'running' | 'finished', testId: '...' } }
const lobbies = {};

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('socket connected:', socket.id);

        // STUDENT: Join Lobby
        socket.on('join-lobby', async ({ testCode, studentName, rollNumber, mobileNumber }) => {
            // Create lobby if not exists (usually Admin should create it, but for simplicity we rely on testCode)
            // Actually Admin should "activate" the test or at least be present.
            // But we can just lazily create the lobby struct in memory when the first person joins.

            if (!lobbies[testCode]) {
                // Verify test exists first
                const test = await Test.findOne({ testCode });
                if (!test) {
                    socket.emit('error', { message: 'Invalid Test Code' });
                    return;
                }
                lobbies[testCode] = {
                    testId: test._id,
                    students: {},
                    status: 'waiting',
                    startTime: null,
                    duration: test.duration
                };
            }

            const lobby = lobbies[testCode];

            // Store student info
            lobby.students[socket.id] = {
                name: studentName,
                rollNumber,
                mobileNumber,
                score: 0
            };

            socket.join(testCode);

            // Notify everyone in lobby (mostly for Admin to see count)
            io.to(testCode).emit('lobby-update', {
                count: Object.keys(lobby.students).length,
                students: Object.values(lobby.students)
            });

            // Send current status to joining student
            socket.emit('test-status', { status: lobby.status });

            console.log(`Student ${studentName} joined lobby ${testCode}`);
        });

        // ADMIN: Start Test
        socket.on('start-test', ({ testCode }) => {
            if (lobbies[testCode]) {
                lobbies[testCode].status = 'running';
                lobbies[testCode].startTime = Date.now();

                // Broadcast to all students in room
                io.to(testCode).emit('test-started', {
                    startTime: lobbies[testCode].startTime,
                    duration: lobbies[testCode].duration
                });
                console.log(`Test ${testCode} started`);
            }
        });

        // ADMIN: Stop Test
        socket.on('stop-test', ({ testCode }) => {
            if (lobbies[testCode]) {
                lobbies[testCode].status = 'finished';
                io.to(testCode).emit('test-ended'); // Force submit
                console.log(`Test ${testCode} stopped by admin`);
            }
        });

        // STUDENT: Submit Test
        socket.on('submit-test', async ({ testCode, answers, timeTaken, violationCount }) => {
            const lobby = lobbies[testCode];
            if (!lobby || !lobby.students[socket.id]) return;

            const student = lobby.students[socket.id];

            // Calculate Score
            // Retrieve Test with answers (need to query DB again to be safe and secure)
            const test = await Test.findById(lobby.testId);
            let score = 0;
            let correctCount = 0;

            test.questions.forEach((q, index) => {
                const studentAnswer = answers[index]; // array of indices or values
                if (!studentAnswer) return;

                // Simple logic for single choice
                if (q.type === 'single') {
                    const correctOption = q.options.find(o => o.isCorrect);
                    // Assuming studentAnswer is the option ID or text. value matches?
                    // Let's assume frontend sends the _id of the selected option.
                    if (correctOption && studentAnswer === correctOption._id.toString()) {
                        score += q.marks;
                        correctCount++;
                    } else if (test.settings.negativeMarking) {
                        // Basic negative marking logic (e.g. -1 or -0.25? Spec says "Optional negative marking", doesn't specify value. Let's assume 0 for now or implement later)
                    }
                }
                // TODO: Multiple choice logic
            });

            // Save Result
            try {
                await Result.create({
                    testId: test._id,
                    studentName: student.name,
                    rollNumber: student.rollNumber,
                    mobileNumber: student.mobileNumber,
                    score,
                    totalQuestions: test.questions.length,
                    correctAnswers: correctCount,
                    timeTaken,
                    violationCount
                });

                socket.emit('result-published', { score, total: test.questions.length * 1 }); // Assuming 1 mark default
            } catch (e) {
                console.error("Error saving result", e);
            }
        });

        socket.on('disconnect', () => {
            // Find which lobby socket was in
            for (const code in lobbies) {
                if (lobbies[code].students[socket.id]) {
                    delete lobbies[code].students[socket.id];
                    io.to(code).emit('lobby-update', {
                        count: Object.keys(lobbies[code].students).length,
                        students: Object.values(lobbies[code].students)
                    });
                    break;
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;
