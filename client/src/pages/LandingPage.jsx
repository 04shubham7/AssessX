import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Users, Monitor, ArrowRight, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero3D from '../components/Hero3D';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const containerRef = useRef(null);

    // GSAP Animation Example (complementing Framer Motion)
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".feature-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".features-grid",
                    start: "top 80%",
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-x-hidden transition-colors duration-300">
            {/* Header - Navbar handles this now */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden min-h-[90vh] flex items-center">
                <Hero3D />
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full bg-gradient-to-b from-indigo-50/50 to-white/0 dark:from-gray-900/50 dark:to-gray-900/0 -z-[2]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 drop-shadow-sm">
                            The Future of <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                                Secure Exams
                            </span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                            Seamlessly conduct online assessments with live proctoring, instant results, and comprehensive analytics.
                        </p>

                        <div className="flex justify-center flex-wrap gap-6">
                            <Link to="/auth/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center"
                                >
                                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                                </motion.button>
                            </Link>
                            <Link to="/student">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    Join a Test
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-white dark:bg-gray-800 transition-colors duration-300 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase"
                        >
                            Features
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
                        >
                            Everything needed to assess talent
                        </motion.p>
                    </div>

                    <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Zap, title: "Real-time Sync", desc: "Live student monitoring via Socket.IO. See who joins and leaves instantly." },
                            { icon: Shield, title: "Anti-Cheating", desc: "Tab-switch detection, fullscreen enforcement, and copy-paste prevention." },
                            { icon: Monitor, title: "Instant Analysis", desc: "Get detailed reports and leaderboards immediately after the test concludes." }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="feature-card p-10 bg-gray-50 dark:bg-gray-700/30 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-lg text-gray-500 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
                            </div>
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
