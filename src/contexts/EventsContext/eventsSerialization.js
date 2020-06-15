/**
 * Stores all logic related to saving and retreiving the state of the events context into memory
 */
import { AsyncStorage } from "react-native";
import { RESTORE_STATE, initialFieldState } from "./EventsReducer";
import Event from "./Event";
import { computeExtraEventData } from "./eventUtils";

/**
 * Serialization constants
 */
const EVENTS_STORAGE_KEY = "@events_context";

export const serializationInfo = {
  events: {
    key: `${EVENTS_STORAGE_KEY}_event_list`,
    serialize: eventState => JSON.stringify(eventState.data),
    deserialize: fieldStateStr => {
      const eventsList = JSON.parse(fieldStateStr).map(
        rawEventObj => new Event(rawEventObj)
      );

      return {
        data: eventsList,
        ...computeExtraEventData(eventsList),
      };
    },
  },
  followCounts: {
    key: `${EVENTS_STORAGE_KEY}_follow_counts`,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
  userFollowedEvents: {
    key: `${EVENTS_STORAGE_KEY}_user_followed_events`,
    serialize: fieldState => {
      const userFollowedEvents = fieldState.data;

      // Turn the set into an array
      return JSON.stringify([...userFollowedEvents]);
    },
    deserialize: followedEventsStateStr => ({
      data: new Set(JSON.parse(followedEventsStateStr)),
    }),
  },
};

/**
 * Saves the given fields state in async storage
 * @param {string} fieldToSave The field whose data you want to save
 * @param {Object} fieldState The current state of field, not including non-data
 * fields (e.g., errorMessage or isLoading)
 */
export async function saveFieldState(fieldToSave, fieldState) {
  const { serialize, key } = serializationInfo[fieldToSave];

  try {
    await AsyncStorage.setItem(key, serialize(fieldState));
  } catch (e) {
    console.warn(`Couldn't save the ${fieldToSave}'s state: ${e.message}`);
  }
}

/**
 * Given a dispatch function, calls the RESTORED_STATE action with deserialized data from
 * AsyncStorage
 * @param {function} dispatch The dispatch function for a reducer
 */
export async function restoreState(dispatch) {
  const promises = [];
  const restoredState = {};

  // Go through every field in the serializationInfo object and deserialize the associated data
  Object.entries(serializationInfo).forEach(([field, { key, deserialize }]) => {
    promises.push(
      AsyncStorage.getItem(key)
        .then(data => {
          if (data) {
            restoredState[field] = {
              ...initialFieldState,
              ...deserialize(data),
            };
          }
        })
        .catch(e =>
          console.warn(`Couldn't restore the state for ${field}: ${e}`)
        )
    );
  });

  await Promise.all(promises);

  dispatch({ type: RESTORE_STATE, restoredState });
}
