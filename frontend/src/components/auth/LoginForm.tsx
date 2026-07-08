import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { firebaseErrorMessage } from "@/utils/firebaseErrors";

interface LoginFormProps {
  /** Switch to the forgot-password view. */
  onForgotPassword: () => void;
}

/**
 * Email/password sign-in form with validation, loading state, and error display.
 * All Firebase calls go through useAuth() → authService — never directly.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): string | null => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
    } catch (err: unknown) {
      setError(firebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-surface-300 mb-1.5">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full h-11 rounded-xl bg-surface-900 border border-surface-700 text-white px-4 text-sm placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-surface-300 mb-1.5">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          className="w-full h-11 rounded-xl bg-surface-900 border border-surface-700 text-white px-4 text-sm placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Forgot password link */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-fade-in">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 flex items-center justify-center gap-2"
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span>{isLoading ? "Signing in..." : "Sign In"}</span>
      </button>
    </form>
  );
};
