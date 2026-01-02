import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';

const TestResults = () => {
    const { testId } = useParams();
    const [results, setResults] = useState([]);
    const [testTitle, setTestTitle] = useState('');

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
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
                    <Button onClick={downloadCSV}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.sort((a, b) => b.score - a.score).map((result, idx) => (
                                    <tr key={result._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            #{idx + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-0">
                                                    <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                                                    <div className="text-sm text-gray-500">{result.rollNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {result.score} / {result.totalQuestions}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {result.timeTaken || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {result.violationCount > 0 ? (
                                                <span className="text-red-500 flex items-center justify-center font-bold">
                                                    <AlertTriangle className="w-4 h-4 mr-1" /> {result.violationCount}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No results available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TestResults;
