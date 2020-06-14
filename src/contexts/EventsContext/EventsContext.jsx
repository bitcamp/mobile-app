import React, {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import eventsReducer, {
  initialState,
  FOLLOW_EVENT,
  UNFOLLOW_EVENT,
} from "./EventsReducer";
import {
  providerFetch,
  processRawEvents,
  computeExtraEventData,
  computePopularEvents,
  computeFeaturedEvents,
  computeOngoingEvents,
} from "./eventUtils";
import mockSchedule from "../../mockData/mockSchedule";
import mockFavoriteCounts from "../../mockData/mockFavoriteCounts";
import { restoreState } from "./eventsSerialization";

const EventsContext = createContext();
const EventActionsContext = createContext();

/**
 * Provides a single EventsManager instance for the entire app to interact with
 */
function EventsProvider({ children }) {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  /**
   * Events API
   * All publicly available functions
   */

  // Gets a list of all the events
  const fetchSchedule = useCallback(
    async () =>
      providerFetch(dispatch, {
        field: "events",
        url: "www.api.bitcamp.com/schedule",
        desiredData: mockSchedule,
        postProcess: processRawEvents,
        getComputedData: computeExtraEventData,
      }),
    []
  );

  // Gets an object mapping event ids to their favorite counts
  const fetchFollowCounts = useCallback(
    async () =>
      providerFetch(dispatch, {
        field: "followCounts",
        url: "www.api.bitcamp.com/followCounts",
        desiredData: mockFavoriteCounts,
      }),
    []
  );

  // Fetch all of the events that a user follows, placing them in a set
  const fetchUserFollowedEvents = useCallback(
    async () =>
      providerFetch(dispatch, {
        field: "userFollowedEvents",
        url: `www.api.bitcamp.com/userFollowedEvents}`,
        desiredData: [],
        postProcess: followedEvents => new Set(followedEvents),
      }),
    []
  );

  // Toggles the following status for a particular event
  // Throws an error if a network request is currently underway
  const toggleFollowingStatus = useCallback(
    async eventID => {
      const isCurrentlyFollowing = state.userFollowedEvents.has(eventID);
      const action = isCurrentlyFollowing ? "unfollow" : "follow";

      // You shouldn't be able to toggle your following status while another
      // network request is underway
      if (state.userFollowedEvents.isLoading) {
        throw new Error(
          `Can't ${action} ${eventID} during another network request`
        );
      }

      const didSucceed = providerFetch(dispatch, {
        field: "userFollowedEvents",
        url: `www.api.bitcamp.com/${action}/${eventID}`,
        fetchParams: {
          method: "POST",
        },
        shouldUpdateData: false,
      });

      // Follow or unfollow the event in state
      if (didSucceed) {
        dispatch({
          type: action === "follow" ? FOLLOW_EVENT : UNFOLLOW_EVENT,
          eventID,
        });
      }
    },
    [state.userFollowedEvents]
  );

  // Returns an array with all of the events sorted by start times
  const getEventsList = useCallback(() => Object.values(state.events.data), [
    state.events.data,
  ]);

  // Returns the event object corresponding to the given id
  const getEvent = useCallback(eventID => state.events.data[eventID], [
    state.events.data,
  ]);

  // Returns the events, split into EventDays (e.g. all events on Friday)
  const getEventDays = useCallback(() => state.events.days, [
    state.events.days,
  ]);

  // Gets the events that are currently happening
  // TODO: possibly adjust how these are ordered
  const getOngoingEvents = useCallback(
    () => computeOngoingEvents(getEventsList()),
    [getEventsList]
  );

  // Gets a list of events ordered by popularity
  const getPopularEvents = useCallback(
    () => computePopularEvents(getEventsList(), state.followCounts.data),
    [getEventsList, state.followCounts.data]
  );

  // Gets a list of events ordered by point value
  const getFeaturedEvents = useCallback(
    () => computeFeaturedEvents(getEventsList()),
    [getEventsList]
  );

  // Returns whether the user is currently following a given event
  const isUserFollowing = useCallback(
    eventID => state.userFollowedEvents.data.has(eventID),
    [state.userFollowedEvents.data]
  );

  // Returns a list of all events that a user is following
  const getUserFollowedEvents = useCallback(
    () => state.userFollowedEvents.data.map(getEvent),
    [getEvent, state.userFollowedEvents.data]
  );

  // Object containing the events api
  const actions = useMemo(
    () => ({
      fetchSchedule,
      fetchFollowCounts,
      toggleFollowingStatus,
      fetchUserFollowedEvents,
      getEventsList,
      getEventDays,
      getFeaturedEvents,
      getEvent,
      getPopularEvents,
      getOngoingEvents,
      isUserFollowing,
      getUserFollowedEvents,
    }),
    [
      fetchFollowCounts,
      fetchSchedule,
      fetchUserFollowedEvents,
      getEvent,
      getEventDays,
      getEventsList,
      getFeaturedEvents,
      getOngoingEvents,
      getPopularEvents,
      getUserFollowedEvents,
      isUserFollowing,
      toggleFollowingStatus,
    ]
  );

  /**
   * Events Effects
   * All state-changing effects
   */

  // When the provider mounts, try to restore the old events data
  // TODO: actually cache the data
  useEffect(() => {
    restoreState(dispatch);
    fetchSchedule();
    fetchFollowCounts();
    fetchUserFollowedEvents();
  }, [fetchFollowCounts, fetchSchedule, fetchUserFollowedEvents]);

  return (
    <EventsContext.Provider value={state}>
      <EventActionsContext.Provider value={actions}>
        {children}
      </EventActionsContext.Provider>
    </EventsContext.Provider>
  );
}

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// TODO: once the codebase is converted to hooks, don't export the EventsContext/EventActionsContext
export { EventsContext, EventActionsContext, EventsProvider };
