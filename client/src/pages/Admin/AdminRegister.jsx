import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardHeader } from '../../components/Layout';

const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { email, password });
            // Auto login after register
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminName', data.email);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader
                    title="Create Admin Account"
                    description="Sign up to start creating tests"
                />
                <form className="space-y-6" onSubmit={handleRegister}>
                    {error && <div className="bg-red-50 text-red-500 p-2 rounded text-sm">{error}</div>}

                    <Input
                        label="Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={loading}
                    >
                        Sign Up
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account? <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AdminRegister;
