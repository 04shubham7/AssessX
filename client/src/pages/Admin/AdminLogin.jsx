import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminName', data.email); // or name
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <Card className="w-full max-w-md border-border/50 shadow-lg group hover:shadow-xl transition-all">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-3xl font-bold tracking-tight">Admin Login</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in to manage tests and results
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm font-medium">{error}</div>}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
