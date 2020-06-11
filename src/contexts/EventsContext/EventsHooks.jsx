import { useContext } from "react";
import { EventsContext, EventActionsContext } from "./EventsContext";

/**
 * Like the default useContext() hook, except it will throw a descriptive error
 * if the context is undefined
 */
function useContextSafely(context, contextName, hookName) {
  const ctx = useContext(context);

  if (ctx === undefined) {
    throw new Error(
      `${hookName} must be used within an ${contextName}Provider`
    );
  }

  return ctx;
}

/**
 * Returns the state of the events context
 */
function useEventsContext() {
  const state = useContextSafely(EventsContext, "EventsContext", "useEvents");

  return state;
}

/**
 * Returns the actions of the events context
 */
function useEventActions() {
  const actions = useContextSafely(
    EventActionsContext,
    "EventActionsContext",
    "useEventActions"
  );

  return actions;
}

/**
 * Returns all of the events split up into days and times
 */
function useEventDays() {
  const { getEventDays } = useContextSafely(
    EventActionsContext,
    "EventActionsContext",
    "useEventDays"
  );

  const eventDays = getEventDays();

  return eventDays;
}

/**
 * Returns the event with the provided id
 */
function useEvent(eventID) {
  const { getEvent } = useContextSafely(
    EventActionsContext,
    "EventActionsContext",
    "useEventDays"
  );

  const event = getEvent(eventID);

  return event;
}

export { useEventsContext, useEventActions, useEventDays, useEvent };
