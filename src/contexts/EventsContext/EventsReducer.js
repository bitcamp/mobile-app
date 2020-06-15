/**
 * The reducer for the events context. Handles the status of network requests,
 * and holds onto fetched data (i.e., the schedule).
 * @param {*} prevState Previous state of the reducer
 * @param {*} action Action to modify the state
 */
export default function eventsReducer(prevState, action) {
  switch (action.type) {
    // Restoring a previous version of the reducer state
    case RESTORE_STATE:
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
          errorMessage: null,
        },
      };

    // The network request succeeded
    case FETCH_SUCCESS:
      return {
        ...prevState,
        [action.field]: {
          ...prevState[action.field],
          ...action.payload,
          isLoading: false,
        },
      };

    // The network request failed
    case FETCH_FAILURE:
      return {
        ...prevState,
        [action.field]: {
          ...prevState[action.field],
          isLoading: false,
          errorMessage: action.errorMessage,
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

export const initialFieldState = {
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

  // A list of event ids
  events: {
    ...initialFieldState,

    /*
     * While both `byId` and `days` contain redundant event objects,
     * we mostly use them to improve performance because they are
     * all commonly used options
     */

    // An object mapping event ids to event objects
    byId: {},

    // List of EventDay objects, which map a given date (e.g., "2020-06-21")
    // to an array of events that are grouped by time of day (e.g., "5:00 PM")
    days: [],
  },

  // Object that maps event ids to follow counts
  followCounts: initialFieldState,

  // Set of event ids that the user follows
  userFollowedEvents: initialFieldState,
};

/** Action Types */
export const RESTORE_STATE = "RESTORE_STATE";
export const FETCH_START = "FETCH_START";
export const FETCH_FAILURE = "FETCH_FAILURE";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FOLLOW_EVENT = "FOLLOW_EVENT";
export const UNFOLLOW_EVENT = "UNFOLLOW_EVENT";
