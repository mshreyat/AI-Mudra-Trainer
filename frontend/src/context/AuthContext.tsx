import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    onAuthStateChanged,
    User,
} from "firebase/auth";

import { auth } from "../services/firebase";
import {
    login,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    logout,
} from "../services/authService";

import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                loginWithEmail,
                registerWithEmail,
                resetPassword,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context)
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    return context;
};