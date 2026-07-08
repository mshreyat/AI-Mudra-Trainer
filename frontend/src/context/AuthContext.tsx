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

    const handleLogin = async (): Promise<void> => {
        await login();
    };

    const handleLoginWithEmail = async (email: string, password: string): Promise<void> => {
        await loginWithEmail(email, password);
    };

    const handleRegisterWithEmail = async (name: string, email: string, password: string): Promise<void> => {
        await registerWithEmail(name, email, password);
    };

    const handleResetPassword = async (email: string): Promise<void> => {
        await resetPassword(email);
    };

    const handleLogout = async (): Promise<void> => {
        await logout();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login: handleLogin,
                loginWithEmail: handleLoginWithEmail,
                registerWithEmail: handleRegisterWithEmail,
                resetPassword: handleResetPassword,
                logout: handleLogout,
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