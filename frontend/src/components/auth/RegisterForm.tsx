import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { firebaseErrorMessage } from "@/utils/firebaseErrors";

/**
 * Registration form with name, email, password, confirm password.
 * After successful registration, Firebase profile is updated with displayName
 * and the user is automatically logged in (handled by authService.registerWithEmail).
 */
export const RegisterForm: React.FC = () => {
  const { registerWithEmail } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return "Name is required.";
    if (name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
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
      await registerWithEmail(name.trim(), email, password);
      // User is automatically signed in after registration
    } catch (err: unknown) {
      setError(firebaseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="register-name" className="block text-sm font-medium text-surface-300 mb-1.5">
          Full Name
        </label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className="w-full h-11 rounded-xl bg-surface-900 border border-surface-700 text-white px-4 text-sm placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-surface-300 mb-1.5">
          Email
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className="block text-sm font-medium text-surface-300 mb-1.5">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          autoComplete="new-password"
          className="w-full h-11 rounded-xl bg-surface-900 border border-surface-700 text-white px-4 text-sm placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="register-confirm" className="block text-sm font-medium text-surface-300 mb-1.5">
          Confirm Password
        </label>
        <input
          id="register-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          autoComplete="new-password"
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
        <span>{isLoading ? "Creating account..." : "Create Account"}</span>
      </button>
    </form>
  );
};
