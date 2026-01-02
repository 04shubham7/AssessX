import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Layout';

const WaitingRoom = () => {
    const { testCode } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();
    const [status, setStatus] = useState('connecting'); // connecting, waiting, error
    const [message, setMessage] = useState('Connecting to server...');

    useEffect(() => {
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (!studentInfo || studentInfo.testCode !== testCode) {
            navigate('/');
            return;
        }

        if (!socket) return;

        // Join Lobby
        socket.emit('join-lobby', {
            testCode,
            studentName: studentInfo.name,
            rollNumber: studentInfo.rollNumber,
            mobileNumber: studentInfo.mobileNumber
        });

        socket.on('test-status', ({ status }) => {
            if (status === 'running') {
                navigate(`/exam/attempt/${testCode}`);
            } else {
                setStatus('waiting');
                setMessage('Waiting for the host to start the test...');
            }
        });

        socket.on('test-started', () => {
            navigate(`/exam/attempt/${testCode}`);
        });

        socket.on('error', ({ message }) => {
            setStatus('error');
            setMessage(message);
        });

        return () => {
            socket.off('test-status');
            socket.off('test-started');
            socket.off('error');
        };
    }, [socket, testCode, navigate]);

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{message}</p>
                    <button onClick={() => navigate('/')} className="text-indigo-600 font-medium">Go Back</button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                    <div className="w-24 h-24 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">You are in the Lobby</h2>
                    <p className="text-gray-500 mt-2">{message}</p>
                    <p className="text-sm text-gray-400 mt-4">Do not refresh or close this window.</p>
                </div>

                <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-600">Joined as:</p>
                    <p className="text-lg font-bold text-gray-900">{JSON.parse(localStorage.getItem('studentInfo') || '{}').name}</p>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;
