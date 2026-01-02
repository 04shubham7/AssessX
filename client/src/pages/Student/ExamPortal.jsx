import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { AlertTriangle, Clock, Maximize, Minimize } from 'lucide-react';
import Button from '../../components/Button';

const ExamPortal = () => {
    const { testCode } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionIndex: optionId/Value }
    const [timeLeft, setTimeLeft] = useState(null); // seconds
    const [violationCount, setViolationCount] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Anti-Cheat State
    const violationRef = useRef(0);

    // Fetch Test Data
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/tests/code/${testCode}`);
                setTest(data);
                // Assuming test started recently, calculate time left. 
                // In real app, we sync 'startTime' from socket 'test-started' or 'test-status' event.
                // For now let's set timeLeft based on duration from NOW (simpler for this prototype).
                // Ideally: timeLeft = (startTime + duration*60*1000 - now) / 1000
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

    // Anti-Cheat: Tab Switching
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !submitted) {
                setViolationCount(prev => prev + 1);
                violationRef.current += 1;
                alert("WARNING: Tab switching is monitored! Further violations may disqualify you.");
            }
        };

        // Disable right click
        const handleContextMenu = (e) => e.preventDefault();
        // Disable copy/paste
        const handleCopy = (e) => e.preventDefault();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("paste", handleCopy);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("copy", handleCopy);
            document.removeEventListener("paste", handleCopy);
        };
    }, [submitted]);

    // Fullscreen Logic
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
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

    if (!test) return <div className="p-8 text-center">Loading Test...</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gray-900 text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">{test.title}</h1>
                        <p className="text-sm text-gray-400">Code: {testCode}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className={`flex items-center space-x-2 text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : ''}`}>
                            <Clock className="w-6 h-6" />
                            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>

                        <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-800 rounded">
                            {isFullscreen ? <Minimize /> : <Maximize />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Warning Banner */}
            {violationCount > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 font-medium">
                            Violation Detected: Tab switching recorded ({violationCount}).
                        </p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
                {test.questions.map((q, idx) => (
                    <div key={idx} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-gray-900"><span className="text-gray-500 mr-2">{idx + 1}.</span> {q.questionText}</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{q.marks} Marks</span>
                        </div>

                        <div className="space-y-3 pl-6">
                            {q.options.map((opt, oIdx) => (
                                <label key={oIdx} className={`flex items-center space-x-3 p-3 rounded border cursor-pointer hover:bg-gray-50 transition-colors ${answers[idx] === opt._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                    <input
                                        type={q.type === 'single' ? 'radio' : 'checkbox'}
                                        name={`q-${idx}`}
                                        value={opt._id}
                                        checked={answers[idx] === opt._id} // TODO: Handle multiple choice check
                                        onChange={() => handleAnswer(idx, opt._id)}
                                        className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="text-gray-700">{opt.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {Object.keys(answers).length} of {test.questions.length} answered
                    </div>
                    <Button onClick={() => handleSubmit(false)} className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700">
                        Submit Test
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ExamPortal;
