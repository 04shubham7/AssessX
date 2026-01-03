import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Play, Eye, Trash2, Clock, FileQuestion, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

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
                if (error.response?.status === 401) {
                    navigate('/admin/login');
                }
            }
        };
        fetchTests();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this test?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/tests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            alert('Failed to delete test');
        }
    };

    return (
        <div className="min-h-screen p-8 pt-24 space-y-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Dashboard
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your assessments and view results</p>
                    </div>

                    <Link to="/admin/create-test">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium shadow-lg hover:shadow-indigo-500/30 transition-all"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Test
                        </motion.button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.map((test, idx) => (
                        <motion.div
                            key={test._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden group transition-all"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {test.title}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${test.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                        {test.isActive ? 'Active' : 'Draft'}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                                            {test.testCode}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-400">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        {test.duration} mins
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mr-3 text-pink-600 dark:text-pink-400">
                                            <FileQuestion className="w-4 h-4" />
                                        </div>
                                        {test.questions.length} questions
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <Link to={`/admin/lobby/${test.testCode}`}>
                                        <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium transition-colors">
                                            <Play className="w-4 h-4 mr-2" /> Lobby
                                        </button>
                                    </Link>
                                    <Link to={`/admin/results/${test._id}`}>
                                        <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors">
                                            <Eye className="w-4 h-4 mr-2" /> Results
                                        </button>
                                    </Link>
                                </div>

                                <button
                                    onClick={() => handleDelete(test._id)}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Test
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {tests.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 mb-4">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tests created yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first assessment.</p>
                            <Link to="/admin/create-test">
                                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-md">
                                    Create Test
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
