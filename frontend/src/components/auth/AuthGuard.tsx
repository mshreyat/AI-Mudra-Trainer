import { useAuth } from "@/context/AuthContext";
import AuthPage from "@/pages/AuthPage";

/**
 * Authentication gate that controls access to the entire application.
 *
 * - While Firebase is determining auth state → shows a loading spinner
 * - If no user is authenticated → renders the AuthPage
 * - If user is authenticated → renders the application (children)
 *
 * This is superior to conditionally rendering a LoginButton inside App.tsx because:
 * 1. It provides a complete visual separation between auth and app states
 * 2. The router, layout, and all app components are never mounted until authenticated
 * 3. It prevents any flash of protected content before auth state resolves
 * 4. It centralizes the auth gate logic in one place instead of scattering checks
 */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Firebase is resolving auth state — show centered spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-900/30 animate-pulse-slow">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>

        {/* Spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-surface-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
        </div>

        <p className="text-sm text-surface-500 font-medium animate-pulse">
          Loading MudraSense...
        </p>
      </div>
    );
  }

  // Not authenticated — show the sign-in page
  if (!user) {
    return <AuthPage />;
  }

  // Authenticated — render the application
  return <>{children}</>;
};
