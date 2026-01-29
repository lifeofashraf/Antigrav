import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const RESUMES_COLLECTION = 'resumes';

/**
 * Save a resume to Firestore
 * @param {string} userId - The user's UID
 * @param {object} resumeData - The resume data to save
 * @param {string} resumeId - Optional existing resume ID for updates
 * @returns {string} The resume document ID
 */
export const saveResume = async (userId, resumeData, resumeId = null) => {
    if (!db) {
        throw new Error('Database not available');
    }

    const id = resumeId || `resume_${Date.now()}`;
    const resumeRef = doc(db, RESUMES_COLLECTION, id);

    await setDoc(resumeRef, {
        ...resumeData,
        userId,
        updatedAt: serverTimestamp(),
        createdAt: resumeId ? resumeData.createdAt : serverTimestamp()
    });

    return id;
};

/**
 * Get a single resume by ID
 * @param {string} resumeId - The resume document ID
 * @returns {object|null} The resume data or null if not found
 */
export const getResume = async (resumeId) => {
    if (!db) return null;

    const resumeRef = doc(db, RESUMES_COLLECTION, resumeId);
    const snapshot = await getDoc(resumeRef);

    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
};

/**
 * Get all resumes for a user
 * @param {string} userId - The user's UID
 * @returns {array} Array of resume objects
 */
export const getUserResumes = async (userId) => {
    if (!db) return [];

    const q = query(
        collection(db, RESUMES_COLLECTION),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Delete a resume
 * @param {string} resumeId - The resume document ID
 */
export const deleteResume = async (resumeId) => {
    if (!db) return;

    const resumeRef = doc(db, RESUMES_COLLECTION, resumeId);
    await deleteDoc(resumeRef);
};
