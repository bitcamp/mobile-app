import { useContextSafely } from "../contextUtils";
import { FollowingActionsContext, FollowingContext } from "./FollowingContext";

/**
 * Provides the context value for the `FollowingContext`
 */
export function useFollowingState() {
  const contextVal = useContextSafely(
    FollowingContext,
    "FollowingProvider",
    "useFollowingState"
  );

  return contextVal;
}

/**
 * Provides an object containing all of the actions from the `FollowingActionsContext`
 */
export function useFollowingActions() {
  const actions = useContextSafely(
    FollowingActionsContext,
    "FollowingProvider",
    "useFollowingActions"
  );

  return actions;
}
