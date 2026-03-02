import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const ResultSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, total } = location.state || { score: 0, total: 0 };
    const studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');

    const percentage = Math.round((score / total) * 100) || 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
            <Card className="w-full max-w-sm text-center border-border/50 shadow-sm bg-card/60 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-yellow-500/20">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-2">Test Completed!</h1>
                    <p className="text-muted-foreground mb-8">Thank you, {studentInfo.name}</p>

                    <div className="bg-secondary/30 rounded-lg p-6 mb-8 border border-border/50 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                        <p className="text-4xl font-extrabold text-primary">{score} <span className="text-lg text-muted-foreground font-normal">/ {total}</span></p>
                        <p className="text-sm font-medium text-muted-foreground mt-2">{percentage}% Correct</p>
                    </div>

                    <Button onClick={() => navigate('/')} size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
                        <Home className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultSummary;
