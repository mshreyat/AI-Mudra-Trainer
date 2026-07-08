/**
 * Maps Firebase auth error codes to user-friendly messages.
 * Keeps all error-handling logic centralized in one place.
 */

const ERROR_MAP: Record<string, string> = {
  // Sign-in errors
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",

  // Registration errors
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/operation-not-allowed": "Email/password sign-in is not enabled.",

  // Reset errors
  "auth/missing-email": "Please enter your email address.",

  // Rate limiting
  "auth/too-many-requests": "Too many attempts. Please try again later.",

  // Network
  "auth/network-request-failed": "Network error. Please check your connection.",

  // Popup
  "auth/popup-closed-by-user": "",
  "auth/cancelled-popup-request": "",
};

/**
 * Extract a user-friendly error message from a Firebase auth error.
 */
export const firebaseErrorMessage = (err: unknown): string => {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    const mapped = ERROR_MAP[code];
    if (mapped !== undefined) return mapped;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "An unexpected error occurred. Please try again.";
};
