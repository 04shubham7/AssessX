import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Play, Eye, Trash2, Clock, FileQuestion, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

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

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild size="lg" className="rounded-full shadow-lg h-12 px-6">
                            <Link to="/admin/create-test">
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Test
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.map((test, idx) => (
                        <motion.div
                            key={test._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full group hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {test.title}
                                        </h3>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${test.isActive ? 'bg-green-500/10 text-green-500' : 'bg-secondary text-muted-foreground'}`}>
                                            {test.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 text-primary">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <span className="font-mono bg-secondary px-2 py-1 rounded text-foreground font-semibold tracking-wider">
                                                {test.testCode}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center mr-3 text-pink-500">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-foreground">{test.duration} mins</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mr-3 text-orange-500">
                                                <FileQuestion className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-foreground">{test.questions.length} questions</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <Button variant="secondary" asChild className="w-full text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-500/10 hover:bg-indigo-500/20">
                                            <Link to={`/admin/lobby/${test.testCode}`}>
                                                <Play className="w-4 h-4 mr-2" /> Lobby
                                            </Link>
                                        </Button>
                                        <Button variant="secondary" asChild className="w-full text-purple-500 hover:text-purple-600 dark:text-purple-400 font-semibold bg-purple-500/10 hover:bg-purple-500/20">
                                            <Link to={`/admin/results/${test._id}`}>
                                                <Eye className="w-4 h-4 mr-2" /> Results
                                            </Link>
                                        </Button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleDelete(test._id)}
                                        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Test
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {tests.length === 0 && (
                        <Card className="col-span-full py-16 text-center border-dashed border-2 bg-transparent shadow-none">
                            <CardContent>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mt-6">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No tests created yet</h3>
                                <p className="text-muted-foreground mb-8">Get started by creating your first assessment.</p>
                                <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                                    <Link to="/admin/create-test">
                                        Create Test
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
