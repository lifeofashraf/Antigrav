import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, staggerContainerVariants, staggerItemVariants } from '../utils/animations';

const Login = () => {
    const { signInWithGoogle, currentUser } = useAuth();
    const navigate = useNavigate();

    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log in", error);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex flex-col justify-center items-center p-6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <motion.div
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
                className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20"
            >
                <motion.div variants={staggerItemVariants}>
                    <Link to="/">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2 hover:opacity-80 transition-opacity">
                            Resumate
                        </h1>
                    </Link>
                </motion.div>

                <motion.p
                    className="text-slate-500 mb-8"
                    variants={staggerItemVariants}
                >
                    Sign in to manage your resumes
                </motion.p>

                <motion.button
                    variants={staggerItemVariants}
                    onClick={handleLogin}
                    className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                    whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </motion.button>

                <motion.p
                    variants={staggerItemVariants}
                    className="mt-6 text-sm text-slate-400"
                >
                    <Link to="/" className="text-indigo-500 hover:text-indigo-600 transition-colors">
                        ← Back to Home
                    </Link>
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

export default Login;
