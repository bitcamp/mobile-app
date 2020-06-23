import { useContextSafely } from "../contextUtils";
import { EventsContext, EventActionsContext } from "./EventsContext";

/**
 * Returns the state of the events context
 */
export function useEventsState() {
  const state = useContextSafely(
    EventsContext,
    "EventsContext",
    "useEventsState"
  );
  return state;
}

/**
 * Returns the actions of the events context
 */
export function useEventActions() {
  const actions = useContextSafely(
    EventActionsContext,
    "EventActionsContext",
    "useEventActions"
  );

  return actions;
}

/**
 * Returns an array containing the state and actions for the events context
 */
export function useEventsContext() {
  return [useEventsState(), useEventActions()];
}
