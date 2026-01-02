import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';
import Button from '../../components/Button';
import { Card } from '../../components/Layout';

const ResultSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total } = location.state || { score: 0, total: 0 };
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');

    const percentage = Math.round((score / total) * 100) || 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-sm text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-yellow-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h1>
                <p className="text-gray-500 mb-8">Thank you, {studentInfo.name}</p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Your Score</p>
                    <p className="text-4xl font-extrabold text-indigo-600">{score} <span className="text-lg text-gray-400 font-normal">/ {total}</span></p>
                    <p className="text-sm font-medium text-gray-400 mt-2">{percentage}% Correct</p>
                </div>

                <Button onClick={() => navigate('/')} variant="primary" className="w-full">
                    <Home className="w-4 h-4 mr-2" /> Back to Home
                </Button>
            </Card>
        </div>
    );
};

export default ResultSummary;
