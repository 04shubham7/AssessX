import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../../components/ui/dialog';

const TestResults = () => {
    const { testId } = useParams();
    const [results, setResults] = useState([]);
    const [testTitle, setTestTitle] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                // We'll need a backend endpoint for this. 
                // I haven't created a specific "get results by testId" endpoint in the plan properly?
                // Wait, did I? `resultRoutes.js` was mentioned but not implemented in the tool calls?
                // I implemented `authRoutes`, `testRoutes`. I missed `resultRoutes`!
                // I need to implement `resultController` and `resultRoutes` on backend too.

                // Let's implement frontend expecting the endpoint exists, then I'll fix backend.
                const { data } = await axios.get(`http://localhost:5000/api/results/${testId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(data);
            } catch (e) {
                console.error("Error fetching results");
            }
        };
        fetchResults();
    }, [testId]);

    const downloadCSV = () => {
        const headers = ['Name', 'Roll Number', 'Mobile', 'Score', 'Total', 'Time Taken', 'Violations'];
        const csvContent = [
            headers.join(','),
            ...results.map(r => [
                r.studentName,
                r.rollNumber,
                r.mobileNumber,
                r.score,
                r.totalQuestions, // Assuming 1 mark per question for simple CSV
                r.timeTaken,
                r.violationCount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `results-${testId}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Results</h1>
                        <p className="text-muted-foreground mt-1">Review student performance and export data.</p>
                    </div>
                    <Button onClick={downloadCSV} variant="outline" className="border-primary/50 hover:bg-primary/10 text-primary">
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>

                <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Violations</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-background/50 divide-y divide-border/50">
                                {results.sort((a, b) => b.score - a.score).map((result, idx) => (
                                    <tr key={result._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">#{idx + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs mr-3 shadow-inner">
                                                    {result.studentName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">{result.studentName}</div>
                                                    <div className="text-xs text-muted-foreground">{result.rollNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                                {result.score} / {result.totalQuestions}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                                            {result.timeTaken || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {result.violationCount > 0 ? (
                                                <span className="flex items-center justify-center text-destructive font-bold bg-destructive/10 px-2 py-1 rounded-md text-xs border border-destructive/20 inline-flex mx-auto">
                                                    <AlertTriangle className="w-3 h-3 mr-1" /> {result.violationCount}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/50 font-bold">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                                                View Answers
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                                                <AlertTriangle className="w-8 h-8" />
                                                <p className="text-lg">No results available yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Answers: {selectedResult?.studentName}</DialogTitle>
                        <DialogDescription>
                            Score: {selectedResult?.score} / {selectedResult?.totalQuestions} | Violations: {selectedResult?.violationCount}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        {selectedResult?.answers?.map((ans, i) => (
                            <div key={i} className="p-4 border rounded-md bg-secondary/20">
                                <p className="font-semibold text-foreground mb-2">Question {i + 1} ({ans.type})</p>
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Student Response:</span>{' '}
                                    {ans.type === 'subjective' ? (
                                        ans.response && ans.response.startsWith('/uploads/') ? (
                                            <a href={`http://localhost:5000${ans.response}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2">
                                                [View Uploaded File]
                                            </a>
                                        ) : (
                                            <p className="mt-1 p-3 bg-background rounded-md border whitespace-pre-wrap">{ans.response || 'No response'}</p>
                                        )
                                    ) : (
                                        <span className={ans.isCorrect ? 'text-green-500 font-bold ml-2' : 'text-destructive font-bold ml-2'}>
                                            {ans.response ? (ans.isCorrect ? 'Correct' : 'Incorrect') : 'Unanswered'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!selectedResult?.answers || selectedResult.answers.length === 0) && (
                            <p className="text-center text-muted-foreground">No detailed answers available.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestResults;
