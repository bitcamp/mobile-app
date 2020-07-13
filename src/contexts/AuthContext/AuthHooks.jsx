import { useContextSafely } from "../contextUtils";
import { AuthContext, AuthActions } from "./AuthContext";

/**
 * Provides the context value for the `AuthContext`
 */
export function useAuthState() {
  const contextVal = useContextSafely(
    AuthContext,
    "AuthProvider",
    "useAuthState"
  );

  return contextVal;
}

/**
 * Provides an object containing all of the actions from the `AuthActions`
 */
export function useAuthActions() {
  const actions = useContextSafely(
    AuthActions,
    "AuthProvider",
    "useAuthActions"
  );

  return actions;
}
