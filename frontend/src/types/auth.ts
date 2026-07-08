import { User } from "firebase/auth";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}