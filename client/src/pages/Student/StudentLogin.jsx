import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader
                    title="Join Examination"
                    description="Enter your details and the test code provided by the invigilator."
                />
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <Input
                        label="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />

                    <Input
                        label="Roll Number"
                        required
                        value={formData.rollNumber}
                        onChange={(e) => handleChange('rollNumber', e.target.value)}
                    />

                    <Input
                        label="Mobile Number"
                        required
                        value={formData.mobileNumber}
                        onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    />

                    <div className="border-t border-gray-200 pt-4">
                        <Input
                            label="Test Code"
                            required
                            placeholder="e.g. 123456"
                            className="text-center text-lg tracking-widest font-mono"
                            value={formData.testCode}
                            onChange={(e) => handleChange('testCode', e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Join Test Lobby
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default StudentLogin;
