import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/dashboard', icon: FileText, label: 'My Resumes' },
        { path: '/editor', icon: PenTool, label: 'Editor' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Link to="/">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                    Resumate
                                </h1>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-indigo-600' : ''}`} />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            {currentUser && (
                <div className="p-3 border-t border-slate-100">
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 ${isCollapsed ? 'justify-center' : ''}`}>
                        {currentUser.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-indigo-600" />
                            </div>
                        )}
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 min-w-0"
                                >
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {currentUser.displayName || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {currentUser.email}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`mt-2 w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-medium"
                                >
                                    Sign Out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            )}

            {/* Login button for non-authenticated users */}
            {!currentUser && (
                <div className="p-3 border-t border-slate-100">
                    <Link
                        to="/login"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <User className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-medium"
                                >
                                    Sign In
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>
            )}
        </motion.aside>
    );
};

export default Sidebar;
