import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Monitor, ArrowRight, TrendingUp, Lock } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero3D from '../components/Hero3D';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const containerRef = useRef(null);
    // Removed GSAP dependency in favor of Framer Motion for reliability

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-500">

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Grid Pattern with higher opacity */}
                <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

                {/* Gradient Orbs with higher opacity */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-500/30 dark:bg-purple-900/40 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vh] bg-indigo-500/30 dark:bg-indigo-900/40 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vh] bg-pink-500/30 dark:bg-pink-900/40 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-normal" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 overflow-visible min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-left"
                        >
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 mb-6 w-fit">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 tracking-wide uppercase">AI Proctoring Live</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                                Secure Exams <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                                    Without Limits.
                                </span>
                            </h1>

                            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
                                The most advanced AI-powered assessment platform. Prevent cheating with eye-tracking, screen monitoring, and real-time analytics.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/auth/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 text-lg font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                                    >
                                        Start for Free <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link to="/student">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 text-lg font-bold text-slate-700 dark:text-white bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-all"
                                    >
                                        Join Exam
                                    </motion.button>
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center space-x-6 text-sm font-medium text-slate-500 dark:text-slate-500">
                                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Free Tier</div>
                                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> No Credit Card</div>
                                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Instant Setup</div>
                            </div>
                        </motion.div>

                        {/* Right Content - 3D/Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative h-[500px] w-full hidden lg:block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
                            <Hero3D />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-3"
                        >
                            Powered by Intelligence
                        </motion.h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white"
                        >
                            Everything you need to <span className="text-indigo-500">assess talent.</span>
                        </motion.h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Real-time Sync",
                                desc: "See students join, leave, and submit in real-time. Powered by Socket.IO for lightning-fast updates.",
                                color: "indigo",
                                gradient: "from-indigo-500/5 to-purple-500/5",
                                iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
                                iconColor: "text-indigo-600 dark:text-indigo-400"
                            },
                            {
                                icon: Shield,
                                title: "Anti-Cheating",
                                desc: "Advanced proctoring with tab-switch detection, fullscreen enforcement, and upcoming eye-tracking.",
                                color: "rose",
                                gradient: "from-rose-500/5 to-orange-500/5",
                                iconBg: "bg-rose-100 dark:bg-rose-900/30",
                                iconColor: "text-rose-600 dark:text-rose-400"
                            },
                            {
                                icon: TrendingUp,
                                title: "Deep Analytics",
                                desc: "Get instant insights into class performance, tough questions, and individual student granular reports.",
                                color: "emerald",
                                gradient: "from-emerald-500/5 to-teal-500/5",
                                iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                                iconColor: "text-emerald-600 dark:text-emerald-400"
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                                className="group relative p-8 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 ${feature.iconColor} group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-lg mt-12">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">AssessX</span>
                        </div>
                        <div className="text-slate-500 text-sm">
                            © 2026 AssessX Inc. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-slate-400">
                            <Lock className="w-5 h-5 hover:text-indigo-500 transition-colors cursor-pointer" />
                            <Monitor className="w-5 h-5 hover:text-indigo-500 transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper for checkmarks
const CheckCircle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default LandingPage;
