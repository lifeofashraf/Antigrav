import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Download, Wand2, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { pageVariants, staggerContainerVariants, staggerItemVariants, easing } from '../utils/animations';

const Home = () => {
    const targetRef = useRef(null);
    const { currentUser } = useAuth();
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <motion.div
            className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Nav */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-slate-50/50 border-b border-transparent hover:border-slate-200 transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easing.smooth }}
            >
                <Link to="/">
                    <motion.div
                        className="font-bold text-xl tracking-tight text-slate-900"
                        whileHover={{ scale: 1.02 }}
                    >
                        Resumate.
                    </motion.div>
                </Link>
                <div className="flex gap-4">
                    {currentUser ? (
                        <Link to="/dashboard">
                            <motion.button
                                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <User className="w-4 h-4" /> Dashboard
                            </motion.button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <motion.button
                                className="px-4 py-2 text-slate-600 font-medium hover:text-indigo-600 transition"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    )}
                </div>
            </motion.nav>

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-500/20 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            {/* Hero Section */}
            <section ref={targetRef} className="h-screen flex flex-col items-center justify-center relative z-10 px-6">
                <motion.div
                    style={{ opacity, scale }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        variants={staggerContainerVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.span
                            variants={staggerItemVariants}
                            className="inline-block py-1 px-3 rounded-full bg-indigo-100/50 border border-indigo-200 text-indigo-700 text-sm font-medium mb-6 backdrop-blur-sm"
                        >
                            v1.0 Public Beta
                        </motion.span>
                        <motion.h1
                            variants={staggerItemVariants}
                            className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 bg-clip-text text-transparent"
                        >
                            Resumate.
                        </motion.h1>
                        <motion.p
                            variants={staggerItemVariants}
                            className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
                        >
                            Build a <span className="text-indigo-600 font-semibold">deterministic</span> setup for your career.
                            LaTeX-grade precision with the ease of a web builder.
                        </motion.p>

                        <motion.div
                            variants={staggerItemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link to="/editor">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center gap-2 overflow-hidden"
                                >
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    Launch Editor <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link to="/editor">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.8)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/50 text-slate-700 font-bold rounded-2xl border border-white/50 shadow-lg backdrop-blur-md flex items-center gap-2"
                                >
                                    View Samples
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
                >
                    <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-2">
                        <motion.div
                            className="w-1 h-2 bg-slate-400 rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Feature Cards / Content for Scroll Effect */}
            <div className="relative z-10 bg-white/30 backdrop-blur-3xl border-t border-white/50">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <motion.div
                        variants={staggerContainerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<FileText className="w-8 h-8 text-blue-600" />}
                            title="LaTeX Precision"
                            description="Forget formatting nightmares. We generate pixel-perfect PDFs every single time."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Wand2 className="w-8 h-8 text-purple-600" />}
                            title="AI Enhanced"
                            description="Rewording, summary generation, and ATS optimization powered by specialized LLMs."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Download className="w-8 h-8 text-green-600" />}
                            title="Instant Export"
                            description="Download your resume in standard PDF format. ATS-parsed, human-readable."
                            delay={0.2}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: easing.smooth }}
                        className="mt-32 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-12 text-slate-800">Why Resumate?</h2>
                        <motion.div
                            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left"
                            variants={staggerContainerVariants}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                        >
                            <CheckItem text="No more fighting with Word margins" />
                            <CheckItem text="Automated ATS keyword optimization" />
                            <CheckItem text="Real-time preview with zoom" />
                            <CheckItem text="Local-first data privacy" />
                        </motion.div>
                    </motion.div>
                </div>

                <motion.footer
                    className="py-10 text-center text-slate-500 text-sm border-t border-slate-200/50 bg-white/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    © 2026 Resumate. Built for builders.
                </motion.footer>
            </div>
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => (
    <motion.div
        variants={staggerItemVariants}
        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.3 }}
        className="p-8 rounded-3xl bg-white/60 border border-white/50 shadow-xl backdrop-blur-md"
    >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

const CheckItem = ({ text }) => (
    <motion.div
        variants={staggerItemVariants}
        className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/40"
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.6)', x: 5 }}
        transition={{ duration: 0.2 }}
    >
        <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
        <span className="text-lg font-medium text-slate-700">{text}</span>
    </motion.div>
);

export default Home;
