import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Monitor, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Shield className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                AssessX
                            </span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/auth/login">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                                    Login
                                </button>
                            </Link>
                            <Link to="/auth/register">
                                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-gradient-to-b from-indigo-50 to-white -z-10" />
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
                <div className="absolute top-20 -right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
                            The Future of <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                Secure & Real-time Exams
                            </span>
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-8">
                            Seamlessly conduct online assessments with live proctoring, instant results, and comprehensive analytics.
                        </p>

                        <div className="flex justify-center flex-wrap gap-4">
                            <Link to="/auth/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center"
                                >
                                    Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link to="/student">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 text-lg font-bold text-indigo-700 bg-white border border-indigo-100 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    Join a Test
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to assess talent
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Real-time Sync", desc: "Live student monitoring via Socket.IO. See who joins and leaves instantly." },
                            { icon: Shield, title: "Anti-Cheating", desc: "Tab-switch detection, fullscreen enforcement, and copy-paste prevention." },
                            { icon: Monitor, title: "Instant Analysis", desc: "Get detailed reports and leaderboards immediately after the test concludes." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-indigo-400" />
                        <span className="ml-2 text-lg font-bold">AssessX</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 AssessX. Built with ❤️ by Shubham.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
