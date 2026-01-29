import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, LogOut, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link to="/">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Resumate
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 hidden md:block">
                        Welcome, {currentUser?.displayName}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-6xl mx-auto p-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">My Resumes</h2>
                        <p className="text-slate-500">Manage and edit your career documents.</p>
                    </div>
                    <Link to="/editor">
                        <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Create New
                        </button>
                    </Link>
                </div>

                {/* Empty State / Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Placeholder for saved resumes */}
                    <Link to="/editor">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full flex flex-col items-center justify-center text-center min-h-[250px] border-dashed border-2 border-slate-300 hover:border-indigo-400"
                        >
                            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-700 mb-1">Create New Resume</h3>
                            <p className="text-sm text-slate-400">Start from scratch</p>
                        </motion.div>
                    </Link>

                    {/* Example Card (Visual Only) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm opacity-50 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 text-sm font-semibold text-slate-500 uppercase tracking-widest">Example</div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2">Software Engineer</h3>
                        <p className="text-xs text-slate-400 mb-4">Last edited 2 days ago</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
