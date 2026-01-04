import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';
import { Shield } from 'lucide-react';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        mobileNumber: '',
        testCode: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.testCode) return;

        // Store in localStorage or pass via state
        localStorage.setItem('studentInfo', JSON.stringify(formData));
        navigate(`/exam/lobby/${formData.testCode}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Join Examination</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Enter your details to proceed to the secure lobby.</p>
                </div>

                <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700 p-8 rounded-2xl shadow-xl">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="bg-white dark:bg-slate-900/50"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Roll Number"
                                required
                                value={formData.rollNumber}
                                onChange={(e) => handleChange('rollNumber', e.target.value)}
                                className="bg-white dark:bg-slate-900/50"
                            />

                            <Input
                                label="Mobile"
                                required
                                value={formData.mobileNumber}
                                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                                className="bg-white dark:bg-slate-900/50"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Test Code</label>
                            <input
                                type="text"
                                required
                                placeholder="• • • • • •"
                                className="block w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase"
                                value={formData.testCode}
                                onChange={(e) => handleChange('testCode', e.target.value)}
                                maxLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02]">
                            Enter Exam Lobby
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
