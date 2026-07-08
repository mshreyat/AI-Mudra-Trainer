import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { firebaseErrorMessage } from "@/utils/firebaseErrors";

interface ForgotPasswordProps {
  /** Switch back to the sign-in view. */
  onBackToLogin: () => void;
}

/**
 * Forgot password form — sends a Firebase password reset email.
 * Shows a success confirmation after sending.
 */
export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validate = (): string | null => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
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
      await resetPassword(email);
      setIsSent(true);
    } catch (err: unknown) {
      setError(firebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        {/* Success icon */}
        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h3 className="text-lg font-display font-semibold text-white">Check Your Email</h3>
        <p className="text-sm text-surface-400 leading-relaxed">
          We've sent a password reset link to <span className="text-surface-200 font-medium">{email}</span>.
          Check your inbox and follow the instructions.
        </p>

        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer font-medium"
        >
          ← Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-lg font-display font-semibold text-white mb-1">Reset Password</h3>
        <p className="text-xs text-surface-400">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-surface-300 mb-1.5">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full h-11 rounded-xl bg-surface-900 border border-surface-700 text-white px-4 text-sm placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
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
        <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
      </button>

      {/* Back link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
        >
          ← Back to Sign In
        </button>
      </div>
    </form>
  );
};
