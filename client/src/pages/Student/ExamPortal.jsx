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
    const [uploading, setUploading] = useState({}); // { qIdx: boolean }

    // Anti-Cheat State (Tracked mostly by ProctoringContainer now, but kept for submission)
    const violationRef = useRef(0);

    // Fetch Test Data
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/tests/code/${testCode}`);
                setTest(data);
                if (data.duration) {
                    setTimeLeft(data.duration * 60);
                }
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
    };

    const handleAnswer = (qIdx, value) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    const handleFileUpload = async (qIdx, file) => {
        if (!file) return;
        setUploading(prev => ({ ...prev, [qIdx]: true }));
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data } = await axios.post('http://localhost:5000/api/tests/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleAnswer(qIdx, data.filePath);
        } catch (error) {
            alert('Upload failed');
            console.error(error);
        } finally {
            setUploading(prev => ({ ...prev, [qIdx]: false }));
        }
    };

    const handleSubmit = async (isAuto = false) => {
        if (submitted) return;
        setSubmitted(true);

        const timeTaken = test ? (test.duration * 60 - timeLeft) : 0;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (socket) {
            socket.emit('submit-test', {
                testCode,
                answers,
                timeTaken: timeString,
                violationCount: violationRef.current
            });
        }
    };

    if (!test) return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
    </div>;

    return (
        <ProctoringContainer testCode={testCode} onViolation={handleViolation}>
            <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pb-24 transition-colors duration-500">
                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30 shadow-sm transition-colors">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{test.title}</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Code: {testCode}</p>
                        </div>

                        <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${timeLeft < 60 ? 'text-red-500 animate-pulse border-red-500/50' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            <Clock className="w-5 h-5" />
                            <span className="text-xl font-mono font-bold tracking-wider">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-6 space-y-8 mt-4">
                    {test.questions.map((q, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed max-w-2xl">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold mr-4 text-sm ring-1 ring-indigo-500/20">{idx + 1}</span>
                                    {q.questionText}
                                </h3>
                                <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">{q.marks} Marks</span>
                            </div>

                            <div className="space-y-4 pl-12">
                                {q.type === 'subjective' ? (
                                    <div className="pt-2">
                                        {q.allowFileUpload ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-4">
                                                    <label className={`flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors ${uploading[idx] ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                        <span>{uploading[idx] ? 'Uploading...' : 'Choose File'}</span>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                                                            className="hidden"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            disabled={uploading[idx]}
                                                        />
                                                    </label>
                                                    {answers[idx] ? (
                                                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                            File Uploaded
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">No file chosen</span>
                                                    )}
                                                </div>
                                                {answers[idx] && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all border p-2 rounded bg-slate-50 dark:bg-slate-900/50">
                                                        Path: {answers[idx]}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <textarea
                                                value={answers[idx] || ''}
                                                onChange={(e) => handleAnswer(idx, e.target.value)}
                                                className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-sans text-base"
                                                placeholder="Type your detailed answer here..."
                                                rows={5}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    q.options.map((opt, oIdx) => (
                                        <label key={oIdx} className={`group flex items-center space-x-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${answers[idx] === opt._id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500 dark:ring-indigo-500' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[idx] === opt._id ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400' : 'border-slate-400 dark:border-slate-500 group-hover:border-indigo-400'}`}>
                                                {answers[idx] === opt._id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type={q.type === 'single' ? 'radio' : 'checkbox'}
                                                name={`q-${idx}`}
                                                value={opt._id}
                                                checked={answers[idx] === opt._id}
                                                onChange={() => handleAnswer(idx, opt._id)}
                                                className="hidden"
                                            />
                                            <span className={`text-base font-medium ${answers[idx] === opt._id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-300'}`}>{opt.text}</span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="fixed bottom-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mr-1">{Object.keys(answers).length}</span>
                            of <span className="text-slate-700 dark:text-slate-300">{test.questions.length}</span> answered
                        </div>
                        <Button onClick={() => handleSubmit(false)} className="px-8 py-3 text-base font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all">
                            Submit Test
                        </Button>
                    </div>
                </div>
            </div>
        </ProctoringContainer>
    );
};

export default ExamPortal;
