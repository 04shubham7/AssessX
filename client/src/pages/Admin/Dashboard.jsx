import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Play, Eye } from 'lucide-react';
import Button from '../../components/Button';
import { Card } from '../../components/Layout';

const Dashboard = () => {
    const [tests, setTests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return navigate('/admin/login');

                const { data } = await axios.get('http://localhost:5000/api/tests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTests(data);
            } catch (error) {
                console.error('Failed to fetch tests', error);
            }
        };
        fetchTests();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <Link to="/admin/create-test">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Test
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <Card key={test._id} className="hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                                    <p className="text-sm text-gray-500">Code: <span className="font-mono font-bold">{test.testCode}</span></p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {test.isActive ? 'Running' : 'Inactive'}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <p>Duration: {test.duration} mins</p>
                                <p>Questions: {test.questions.length}</p>
                            </div>

                            <div className="flex space-x-3">
                                <Link to={`/admin/lobby/${test.testCode}`} className="flex-1">
                                    <Button variant="primary" className="w-full">
                                        <Play className="w-4 h-4 mr-2" />
                                        Lobby
                                    </Button>
                                </Link>
                                <Link to={`/admin/results/${test._id}`} className="flex-1">
                                    <Button variant="secondary" className="w-full">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Results
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}

                    {tests.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No tests found. Create your first test!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
