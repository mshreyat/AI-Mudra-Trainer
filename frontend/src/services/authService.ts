import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signOut,
} from "firebase/auth";

import { auth } from "./firebase";

// ─── Google Auth (unchanged) ─────────────────────────────────────────

const provider = new GoogleAuthProvider();

export const login = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

export const logout = async () => {
    await signOut(auth);
};

// ─── Email/Password Auth ─────────────────────────────────────────────

/**
 * Sign in with email and password.
 */
export const loginWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
};

/**
 * Register a new user with email, password, and display name.
 * After creating the account, updates the Firebase profile with the name
 * so it appears in user.displayName immediately.
 */
export const registerWithEmail = async (
    name: string,
    email: string,
    password: string
) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result.user;
};

/**
 * Send a password reset email via Firebase.
 */
export const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};