import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Standalone logout button. Never calls Firebase directly — uses AuthContext.
 */
export default function LogoutButton() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch {
      // AuthContext will update state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full bg-surface-800 text-surface-300 text-sm font-medium hover:bg-surface-700 hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer border border-surface-700"
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      )}
      <span>{isLoading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}