import React, {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { AsyncStorage } from "react-native";
import eventsReducer, {
  initialState,
  FOLLOW_EVENT,
  UNFOLLOW_EVENT,
} from "./EventsReducer";
import { providerFetch } from "./eventUtils";
import mockSchedule from "../../mockData/mockSchedule";
import mockFavoriteCounts from "../../mockData/mockFavoriteCounts";

const EVENTS_STORAGE_KEY = "EVENTS_STATE";
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

  // Returns the event object corresponding to the given id
  const getEvent = useCallback(eventID => state.events.data[eventID], [
    state.events,
  ]);

  // Returns an array with all of the events sorted by start times
  const getSortedEvents = useCallback(() => state.events.sorted, [
    state.events.sorted,
  ]);

  // Returns the events that are the most
  const getEventDays = useCallback(() => state.events.days, [
    state.events.days,
  ]);

  // Gets the events that are currently happening
  const getHappeningNow = useCallback(() => {
    const now = moment();
    return getSortedEvents().filter(event =>
      now.isBetween(event.startTime, event.endTime)
    );
  }, [getSortedEvents]);

  // Returns whether the user is currently following a given event
  const isUserFollowing = useCallback(
    eventID => state.userFollowedEvents.has(eventID),
    [state.userFollowedEvents]
  );

  // Returns a list of all events that a user is following
  const getUserFollowedEvents = useCallback(
    () => state.userFollowedEvents.map(getEvent),
    [getEvent, state.userFollowedEvents]
  );

  // Object containing the events api
  const actions = useMemo(
    () => ({
      fetchSchedule,
      fetchFollowCounts,
      toggleFollowingStatus,
      fetchUserFollowedEvents,
      getEventDays,
      getEvent,
      getHappeningNow,
      isUserFollowing,
      getUserFollowedEvents,
    }),
    [
      fetchFollowCounts,
      fetchSchedule,
      fetchUserFollowedEvents,
      getEvent,
      getEventDays,
      getHappeningNow,
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
    const restoreEventsState = async () => {
      let restoredState;

      try {
        restoredState = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      } catch (e) {
        // Restoring state failed (i.e., because the user has never used the app before)
        restoredState = {};
      }

      dispatch({ type: "RESTORE_STATE", restoredState });

      // TODO: possibly fetch new schedule data here
    };

    restoreEventsState();
  }, []);

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
