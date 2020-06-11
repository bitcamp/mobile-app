/**
 * The reducer for the events context. Handles the status of network requests,
 * and holds onto fetched data (i.e., the schedule).
 * @param {*} prevState Previous state of the reducer
 * @param {*} action Action to modify the state
 */
export default function eventsReducer(prevState, action) {
  switch (action.type) {
    // Restoring a previous version of the reducer state
    case RESTORE_EVENTS:
      return {
        ...prevState,
        ...action.restoredState,
        isRestoring: false,
      };

    // Start fetching async data
    case FETCH_START:
      return {
        ...prevState,
        [action.field]: {
          isLoading: true,
          error: null,
        },
      };

    // The network request succeeded
    case FETCH_SUCCESS:
      return {
        ...prevState,
        [action.field]: {
          ...prevState[action.field],
          isLoading: false,
          data: action.data || prevState[action.field].data,
          ...(action.computedData || {}),
        },
      };

    // The network request failed
    case FETCH_FAILURE:
      return {
        ...prevState,
        [action.field]: {
          ...prevState[action.field],
          isLoading: false,
          errorMessage: action.error.message,
        },
      };

    // Follow an event
    case FOLLOW_EVENT:
      return {
        ...prevState,
        followCounts: {
          ...prevState.followCounts,
          [action.eventID]: prevState.followCounts[action.eventID] + 1,
        },
        userFollowedEvents: prevState.userFollowedEvents.add(action.eventID),
      };

    // Unfollow an event
    case UNFOLLOW_EVENT:
      return {
        ...prevState,
        followCounts: {
          ...prevState.followCounts,
          [action.eventID]: prevState.followCounts[action.eventID] - 1,
        },
        userFollowedEvents: prevState.userFollowedEvents.delete(action.eventID),
      };

    default:
      throw new Error(
        `Events Reducer received an invalid action type: ${action.type}`
      );
  }
}

const initialFieldState = {
  // Whether a network request is currently underway
  isLoading: false,

  // The last accurate data corresponding to the field
  // (i.e., there could have been an error with the last network request,
  // but this field will still be populated with the old data)
  data: null,

  // The error message associated with the most recent network request.
  // If there was no error with the most recent network request, this
  // is null.
  errorMessage: null,
};

/** Reducer's starting state */
export const initialState = {
  isRestoring: false,

  // An object mapping event ids to event objects
  events: {
    ...initialFieldState,
    // Flattened list of events sorted by start time
    sorted: [],

    // Object that maps days of the week (e.g., "Friday")
    // to an array of events, grouped by time of day (e.g., "5:00 PM")
    days: {},
  },

  // Object that maps event ids to follow counts
  followCounts: initialFieldState,

  // Set of event ids that the user follows
  userFollowedEvents: initialFieldState,
};

/** Action Types */
export const RESTORE_EVENTS = "RESTORE_EVENTS";
export const FETCH_START = "FETCH_START";
export const FETCH_FAILURE = "FETCH_FAILURE";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FOLLOW_EVENT = "FOLLOW_EVENT";
export const UNFOLLOW_EVENT = "UNFOLLOW_EVENT";
