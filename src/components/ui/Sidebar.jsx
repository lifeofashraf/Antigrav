import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    FileText,
    LogOut,
    ChevronLeft,
    User,
    PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared transition config for perfect sync
const sidebarTransition = {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1] // Material design easing
};

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
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={sidebarTransition}
            className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[65px]">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Link to="/">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                    Resumate
                                </h1>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={sidebarTransition}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-hidden">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive(item.path)
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-indigo-600' : ''}`} />
                        <motion.span
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                x: isCollapsed ? -10 : 0
                            }}
                            transition={sidebarTransition}
                            className="font-medium whitespace-nowrap overflow-hidden"
                        >
                            {item.label}
                        </motion.span>
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
                        <motion.div
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                width: isCollapsed ? 0 : 'auto'
                            }}
                            transition={sidebarTransition}
                            className="flex-1 min-w-0 overflow-hidden"
                        >
                            <p className="text-sm font-medium text-slate-800 truncate">
                                {currentUser.displayName || 'User'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {currentUser.email}
                            </p>
                        </motion.div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`mt-2 w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <motion.span
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                x: isCollapsed ? -10 : 0
                            }}
                            transition={sidebarTransition}
                            className="font-medium overflow-hidden"
                        >
                            Sign Out
                        </motion.span>
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
                        <motion.span
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                x: isCollapsed ? -10 : 0
                            }}
                            transition={sidebarTransition}
                            className="font-medium overflow-hidden"
                        >
                            Sign In
                        </motion.span>
                    </Link>
                </div>
            )}
        </motion.aside>
    );
};

export default Sidebar;
