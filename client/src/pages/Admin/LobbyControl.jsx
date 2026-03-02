import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { Users, Play, Square, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card className="flex flex-col md:flex-row justify-between items-center p-6 border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-foreground">{testDetails?.title || 'Loading...'}</h1>
                        <p className="text-muted-foreground mt-1">Code: <span className="font-mono font-bold text-lg text-primary">{testCode}</span></p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-2">
                                    {testStatus === 'running' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${testStatus === 'running' ? 'bg-green-500' : testStatus === 'waiting' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
                                </span>
                                <p className={`font-bold uppercase tracking-wider text-sm ${testStatus === 'running' ? 'text-green-500' : 'text-muted-foreground'}`}>{testStatus}</p>
                            </div>
                        </div>

                        {testStatus === 'waiting' && (
                            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                                <Play className="w-5 h-5 mr-2" /> Start Test
                            </Button>
                        )}

                        {testStatus === 'running' && (
                            <Button onClick={handleStop} variant="destructive" className="shadow-lg shadow-red-600/20">
                                <Square className="w-5 h-5 mr-2" /> Stop Test
                            </Button>
                        )}

                        {testStatus === 'finished' && (
                            <Button variant="secondary" asChild className="shadow-lg">
                                <Link to={`/admin/results/${testDetails?._id}`}>
                                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> View Results
                                </Link>
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="md:col-span-3 border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Live Student Lobby</CardTitle>
                            <CardDescription>{students.length} students joined</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {students.map((student, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <p className="text-sm font-semibold text-foreground truncate">{student.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{student.rollNumber}</p>
                                        </div>
                                    </div>
                                ))}
                                {students.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-muted-foreground/60 italic border-2 border-dashed border-border/50 rounded-lg">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Users className="w-8 h-8 opacity-20" />
                                            <p>Waiting for students to join...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <Users className="w-5 h-5 mr-2 text-primary" /> Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-secondary/20 p-3 rounded-md">
                                        <span className="text-muted-foreground text-sm font-medium">Total Joined</span>
                                        <span className="font-bold text-lg text-primary">{students.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-secondary/20 p-3 rounded-md">
                                        <span className="text-muted-foreground text-sm font-medium">Duration</span>
                                        <span className="font-bold text-foreground">{testDetails?.duration} mins</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LobbyControl;
