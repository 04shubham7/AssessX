import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAdmin = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        navigate('/auth/login');
    };

    const isExamPage = location.pathname.startsWith('/exam/attempt');

    // Don't show navbar on actual exam attempt page to prevent distractions/exit
    if (isExamPage) return null;

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            AssessX
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAdmin ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {adminName}
                                </span>
                                <Link to="/admin/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/student" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Join Test
                                </Link>
                                <Link to="/auth/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Admin Login
                                </Link>
                                <Link to="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-600 dark:text-gray-300"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 pt-2 pb-4 space-y-2">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                        <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {isAdmin ? (
                        <>
                            <div className="text-sm font-bold text-gray-900 dark:text-white py-2">{adminName}</div>
                            <Link to="/admin/dashboard" className="block w-full text-left py-2 text-gray-600 dark:text-gray-300">Dashboard</Link>
                            <button onClick={handleLogout} className="w-full text-left py-2 text-red-500 font-medium">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/student" className="block w-full py-2 text-gray-600 dark:text-gray-300">Join Test</Link>
                            <Link to="/auth/login" className="block w-full py-2 text-gray-600 dark:text-gray-300">Admin Login</Link>
                            <Link to="/auth/register" className="block w-full py-2 text-indigo-600 font-bold">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
