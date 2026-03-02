import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
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
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                </div>

                <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-xl">
                    <CardHeader className="text-center space-y-2 pb-6">
                        <CardTitle className="text-3xl font-bold tracking-tight">Join Examination</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter your details to proceed to the secure lobby.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rollNumber">Roll Number</Label>
                                    <Input
                                        id="rollNumber"
                                        required
                                        value={formData.rollNumber}
                                        onChange={(e) => handleChange('rollNumber', e.target.value)}
                                        className="bg-background/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobileNumber">Mobile</Label>
                                    <Input
                                        id="mobileNumber"
                                        required
                                        value={formData.mobileNumber}
                                        onChange={(e) => handleChange('mobileNumber', e.target.value)}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 space-y-2">
                                <Label htmlFor="testCode" className="block text-center mb-2">Test Code</Label>
                                <Input
                                    id="testCode"
                                    type="text"
                                    required
                                    placeholder="• • • • • •"
                                    className="block w-full px-4 py-6 text-center text-3xl tracking-[0.5em] font-mono rounded-xl bg-background shadow-inner transition-all uppercase focus-visible:ring-primary focus-visible:ring-offset-2"
                                    value={formData.testCode}
                                    onChange={(e) => handleChange('testCode', e.target.value)}
                                    maxLength={6}
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full text-lg mt-4 font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]">
                                Enter Exam Lobby
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StudentLogin;
