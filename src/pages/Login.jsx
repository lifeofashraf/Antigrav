import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                    Resumate
                </h1>
                <p className="text-slate-500 mb-8">Sign in to manage your resumes</p>

                <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Sign in with Google
                </button>
            </motion.div>
        </div>
    );
};

export default Login;
