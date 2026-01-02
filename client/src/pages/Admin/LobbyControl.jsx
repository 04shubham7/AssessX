import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { Users, Play, Square, Trophy } from 'lucide-react';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';

const LobbyControl = () => {
    const { testCode } = useParams();
    const socket = useSocket();
    const [students, setStudents] = useState([]);
    const [testStatus, setTestStatus] = useState('waiting'); // waiting, running, finished
    const [testDetails, setTestDetails] = useState(null);

    useEffect(() => {
        // Fetch test details for context
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const { data } = await axios.get(`http://localhost:5000/api/tests/code/${testCode}`); // Using public endpoint for ease, or use ID if available
                // Ideally we should use the ID from the route, but let's assume route is /lobby/:testCode for simplicity
                // Wait, the public endpoint doesn't require auth but we act as admin. 
                // We probably want the full details so we should use `api/tests` list or get by ID.
                // But here we only have testCode from URL. Let's use the code endpoint for now as it gives title/duration.
                setTestDetails(data);
            } catch (e) {
                console.error("Error fetching test details");
            }
        };
        fetchTest();
    }, [testCode]);

    useEffect(() => {
        if (!socket) return;

        // Join the room as an admin/observer?
        // Actually our backend logic for 'join-lobby' is specific to students (requires name/roll).
        // Admin just listens. So admin needs to join the room 'testCode'.
        // NOTE: In current backend implementation `socket.join(testCode)` happens inside `join-lobby`.
        // Admin needs a way to join the room without being a student.
        // Let's add a `join-admin-room` event or just reuse `join-lobby` with a flag? or just emit a specific event.
        // Actually, `socket.join` is server side. 
        // We didn't allow arbitrary joins.
        // Let's assume for now we need to emit a 'admin-join' event. 
        // Wait, I didn't implement 'admin-join' in the backend. 
        // IMPORTANT: I need to update the backend Socket Handler to allow Admin to join the room to receive updates.

        socket.emit('admin-join', { testCode });

        socket.on('lobby-update', ({ students }) => {
            setStudents(students);
        });

        socket.on('test-started', () => setTestStatus('running'));
        socket.on('test-ended', () => setTestStatus('finished'));

        return () => {
            socket.off('lobby-update');
            socket.off('test-started');
            socket.off('test-ended');
        };
    }, [socket, testCode]);

    const handleStart = () => {
        if (socket) {
            socket.emit('start-test', { testCode });
            setTestStatus('running');
        }
    };

    const handleStop = () => {
        if (socket) {
            socket.emit('stop-test', { testCode });
            setTestStatus('finished');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{testDetails?.title || 'Loading...'}</h1>
                        <p className="text-gray-500">Code: <span className="font-mono font-bold text-lg text-indigo-600">{testCode}</span></p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right mr-4">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className={`font-bold uppercase ${testStatus === 'running' ? 'text-green-600' : 'text-gray-600'}`}>{testStatus}</p>
                        </div>

                        {testStatus === 'waiting' && (
                            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                                <Play className="w-5 h-5 mr-2" /> Start Test
                            </Button>
                        )}

                        {testStatus === 'running' && (
                            <Button onClick={handleStop} variant="danger">
                                <Square className="w-5 h-5 mr-2" /> Stop Test
                            </Button>
                        )}

                        {testStatus === 'finished' && (
                            <Link to={`/admin/results/${testDetails?._id}`}>
                                <Button variant="secondary">
                                    <Trophy className="w-5 h-5 mr-2" /> View Results
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="md:col-span-3">
                        <CardHeader
                            title="Live Student Lobby"
                            description={`${students.length} students joined`}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {students.map((student, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{student.rollNumber}</p>
                                    </div>
                                </div>
                            ))}
                            {students.length === 0 && (
                                <div className="col-span-full py-8 text-center text-gray-400 italic">
                                    Waiting for students to join...
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2" /> Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Joined</span>
                                    <span className="font-bold">{students.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-bold">{testDetails?.duration} mins</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LobbyControl;
