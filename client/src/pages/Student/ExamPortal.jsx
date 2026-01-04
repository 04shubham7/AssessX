import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { Clock } from 'lucide-react';
import Button from '../../components/Button';
import ProctoringContainer from '../../components/ProctoringContainer';

const ExamPortal = () => {
    const { testCode } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionIndex: optionId/Value }
    const [timeLeft, setTimeLeft] = useState(null); // seconds
    const [submitted, setSubmitted] = useState(false);

    // Anti-Cheat State (Tracked mostly by ProctoringContainer now, but kept for submission)
    const violationRef = useRef(0);

    // Fetch Test Data
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/tests/code/${testCode}`);
                setTest(data);
                setTimeLeft(data.duration * 60);
            } catch (error) {
                console.error("Failed to load test");
            }
        };
        fetchTest();
    }, [testCode]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('test-ended', () => {
            handleSubmit(true); // Force Submit
        });

        socket.on('result-published', ({ score, total }) => {
            navigate('/exam/result', { state: { score, total } });
        });

        return () => {
            socket.off('test-ended');
            socket.off('result-published');
        };
    }, [socket, navigate]);

    // Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Disable right click & copy (Additional layer)
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleCopy = (e) => e.preventDefault();

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("paste", handleCopy);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("paste", handleCopy);
        };
    }, []);

    const handleViolation = (msg) => {
        violationRef.current += 1;
        // Optionally auto-submit if too many violations:
        // if (violationRef.current > 3) handleSubmit(true);
    };

    const handleAnswer = (qIdx, value) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    const handleSubmit = async (isAuto = false) => {
        if (submitted) return;
        setSubmitted(true);

        // Calculate final time taken
        const timeTaken = test ? (test.duration * 60 - timeLeft) : 0;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Emit to socket
        if (socket) {
            socket.emit('submit-test', {
                testCode,
                answers,
                timeTaken: timeString,
                violationCount: violationRef.current
            });
        }
    };

    if (!test) return <div className="p-8 text-center flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;

    return (
        <ProctoringContainer testCode={testCode} onViolation={handleViolation}>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="bg-white border-b p-4 sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">{test.title}</h1>
                            <p className="text-sm text-gray-500">Code: {testCode}</p>
                        </div>

                        <div className={`flex items-center space-x-2 text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}>
                            <Clock className="w-5 h-5" />
                            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32 mt-4">
                    {test.questions.map((q, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                                    <span className="text-indigo-500 font-bold mr-3">{idx + 1}.</span>
                                    {q.questionText}
                                </h3>
                                <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{q.marks} Marks</span>
                            </div>

                            <div className="space-y-3 pl-8">
                                {q.options.map((opt, oIdx) => (
                                    <label key={oIdx} className={`group flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[idx] === opt._id ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${answers[idx] === opt._id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400 group-hover:border-indigo-400'}`}>
                                            {answers[idx] === opt._id && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <input
                                            type={q.type === 'single' ? 'radio' : 'checkbox'} // Note: Checkbox logic simplified here for now
                                            name={`q-${idx}`}
                                            value={opt._id}
                                            checked={answers[idx] === opt._id}
                                            onChange={() => handleAnswer(idx, opt._id)}
                                            className="hidden" // Hiding default radio
                                        />
                                        <span className={`text-gray-700 font-medium ${answers[idx] === opt._id ? 'text-indigo-900' : ''}`}>{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t p-4 z-20">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-500">
                            <span className="text-indigo-600 font-bold">{Object.keys(answers).length}</span> of {test.questions.length} answered
                        </div>
                        <Button onClick={() => handleSubmit(false)} className="px-8 py-2.5 text-base font-semibold shadow-lg shadow-indigo-500/30">
                            Submit Test
                        </Button>
                    </div>
                </div>
            </div>
        </ProctoringContainer>
    );
};

export default ExamPortal;
