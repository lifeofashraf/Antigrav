import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        if (!auth) {
            throw new Error('Authentication not configured');
        }
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) {
            return;
        }
        try {
            return await signOut(auth);
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!auth) {
            console.warn('Firebase auth not available');
            setLoading(false);
            return;
        }

        try {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        } catch (error) {
            console.error('Auth state change listener failed:', error);
            setLoading(false);
        }
    }, []);

    const value = {
        currentUser,
        signInWithGoogle,
        logout,
        loading
    };

    // Always render children - let individual components handle loading state
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
