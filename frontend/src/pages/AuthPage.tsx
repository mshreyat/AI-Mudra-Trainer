import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPassword } from "@/components/auth/ForgotPassword";

// ─── View States ─────────────────────────────────────────────────────

type AuthView = "login" | "register" | "forgot-password";

// ─── Component ───────────────────────────────────────────────────────

/**
 * Full-screen authentication page with:
 * - Google sign-in
 * - Email/Password login
 * - Registration
 * - Forgot Password
 *
 * Uses tab-style toggle to switch between Login and Register.
 */
export default function AuthPage() {
  const { login } = useAuth();
  const [view, setView] = useState<AuthView>("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      await login();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      if (!message.includes("popup-closed-by-user") && !message.includes("cancelled-popup-request")) {
        setGoogleError(message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* ── Background Ambient Gradients ── */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary-900/15 rounded-full blur-3xl -z-0 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-900/10 rounded-full blur-3xl -z-0 animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/8 rounded-full blur-3xl -z-0" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="glass-card p-10 border-surface-700/60">
          {/* Logo + Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-900/30 mb-5">
              <div className="w-6 h-6 bg-white rounded-full" />
            </div>

            <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-1">
              MudraSense<span className="text-primary-400">.ai</span>
            </h1>
            <p className="text-surface-400 text-sm text-center max-w-xs leading-relaxed mt-2">
              AI-powered Bharatanatyam Mudra trainer with real-time hand tracking, intelligent coaching, and progress analytics.
            </p>
          </div>

          {/* ── Forgot Password View ── */}
          {view === "forgot-password" ? (
            <ForgotPassword onBackToLogin={() => setView("login")} />
          ) : (
            <>
              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full h-12 rounded-xl bg-white text-surface-900 font-medium text-sm flex items-center justify-center gap-3 hover:bg-surface-100 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-surface-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{isGoogleLoading ? "Signing in..." : "Continue with Google"}</span>
              </button>

              {/* Google Error */}
              {googleError && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-fade-in">
                  {googleError}
                </div>
              )}

              {/* ── OR Divider ── */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-surface-700/50" />
                <span className="text-xs text-surface-500 uppercase tracking-wider font-medium">OR</span>
                <div className="flex-1 h-px bg-surface-700/50" />
              </div>

              {/* ── Login / Register Tab Toggle ── */}
              <div className="flex bg-surface-900 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    view === "login"
                      ? "bg-surface-700 text-white shadow-sm"
                      : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    view === "register"
                      ? "bg-surface-700 text-white shadow-sm"
                      : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* ── Form ── */}
              {view === "login" ? (
                <LoginForm onForgotPassword={() => setView("forgot-password")} />
              ) : (
                <RegisterForm />
              )}
            </>
          )}

          {/* Footer */}
          <p className="text-xs text-surface-600 text-center mt-8 leading-relaxed">
            By signing in, you agree to use MudraSense AI
            <br />for educational and personal practice purposes.
          </p>
        </div>

        {/* Bottom tag */}
        <p className="text-xs text-surface-600 text-center mt-6">
          Built with ❤️ using MediaPipe & AI
        </p>
      </div>
    </div>
  );
}
