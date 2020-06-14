import _ from "lodash";
import moment from "moment";
import { FETCH_START, FETCH_FAILURE, FETCH_SUCCESS } from "./EventsReducer";
import mockFetch from "../../mockData/mockFetch";
import EventDay from "./EventDay";
import { getDay } from "./timeUtils";
import Event, { EVENT_SCHEMA } from "./Event";
import { saveFieldState } from "./eventsSerialization";

const returnSelf = data => data;
const returnEmptyObj = () => ({});

/**
 * Fetches a resource used by the event provider. Automatically handles the reducer state
 * handling during the fetch call. Also saves the state for the given field in AsyncStorage.
 * @param {Function} dispatch The dispatch function for the reducer
 * @param {Object} options Additional options for the function (described below)
 * @param {string} options.field The field the reducer should be updating (REQUIRED)
 * @param {string} options.url The location of the data you want (REQUIRED)
 * @param {*} [options.desiredData = null] The data that you would like mockFetch to return (TODO: delete in production)
 * @param {Object} [options.fetchOptions] Any options for the fetch call
 * @param {Function} [options.postProcess = (rawData) => data] Function to run on the processed data
 * @param {Function} [options.getComputedData = () => ({})] Function to calculate any additional values included in the field
 * (e.g., events.sorted)
 * @param {boolean} [options.shouldUpdateData = true] Whether the data from the fetch call should
 * replace the data for the specified field
 * @returns True if the fetch succeeded, false otherwise
 */
export async function providerFetch(
  dispatch,
  {
    field,
    url,
    desiredData = null,
    fetchOptions,
    postProcess = returnSelf,
    shouldUpdateData = true,
    getComputedData = returnEmptyObj,
  } = {}
) {
  // Ensure required parameters are all present
  if (!dispatch || !field || !url) {
    throw new Error(
      `Missing the required parameters:${!dispatch ? " dispatch" : ""}${
        !url ? " url" : ""
      }${!field ? " field" : ""}`
    );
  }

  dispatch({ type: FETCH_START });

  try {
    const response = await mockFetch(url, desiredData, fetchOptions);

    // Handle errors that fetch doesn't typically catch
    if (!response.ok) {
      throw new Error(`Received HTTP code ${response.status}`);
    }

    // Process data
    const rawData = await response.json();
    const data = postProcess(rawData);

    // Tell the reducer that the request succeeded (optionally updating the
    // data field and computing additional field data)
    const action = { type: FETCH_SUCCESS, field };
    if (shouldUpdateData) {
      action.payload = {
        data,
        ...getComputedData(data),
      };
    }

    dispatch(action);

    if (shouldUpdateData) {
      saveFieldState(field, action.payload).catch();
    }

    return true;
  } catch (e) {
    dispatch({
      type: FETCH_FAILURE,
      field,
      errorMessage: e.message.includes("JSON.parse")
        ? `Parsing error: ${url} doesn't return valid JSON data`
        : `Unable to fetch ${url}`,
    });

    return false;
  }
}

/**
 * Turns a list of events into an object that maps event ids to event objects
 * @param {Object[]} rawEvents A list of raw event objects
 * @throws if the event data for ALL events is malformed.
 * @returns {Event[]} a list of Events, with all invalid events removed
 */
export function processRawEvents(rawEvents) {
  const validationErrors = [];

  const processedEvents = rawEvents
    .filter(rawEvent => {
      // We use a try/catch block with `validateSync()` instead of a simple
      // `isValidSync()` call so that we can get descriptive error messages (as opposed
      // to a true/false answer)
      try {
        EVENT_SCHEMA.validateSync(rawEvent, { abortEarly: true, strict: true });
        return true;
      } catch (error) {
        validationErrors.push(
          `Invalid event (id: ${rawEvent ? rawEvent.id : "undefined"}): ${
            error.message
          }`
        );
        return false;
      }
    })
    .map(event => new Event(EVENT_SCHEMA.cast(event)));

  if (rawEvents.length > 0 && processedEvents.length === 0) {
    throw new Error(
      `No events passed validation. Encountered the following errors: ${validationErrors.toString()}`
    );
  }

  return computeIdToEventMap(processedEvents);
}

/**
 * Turns a list of events into an object that maps event ids to event objects
 * PRECONDITION: the list of events must be VALID.
 * @param {Event[]} events A list of valid events
 * @returns {Object} a processed object mapping of event ids to event objects
 */
export function computeIdToEventMap(events) {
  const idToEventsMap = {};

  events.forEach(event => {
    idToEventsMap[event.id] = event;
  });

  return idToEventsMap;
}

/**
 * Computes additional data that should be stored inside the `events` field.
 * @param {Object} eventsObj An object mapping event ids to events
 */
export function computeExtraEventData(eventsObj) {
  return {
    days: computeEventDays(Object.values(eventsObj)),
  };
}

/**
 * Splits a list of events into a list of EventDays. Orders the EventDays by date.
 * @param {Event[]} events A list of events
 * @returns {EventDay[]} A list of event days, ordered by date
 */
export function computeEventDays(events) {
  const eventDayObj = _.groupBy(events, event => getDay(event.startTime));

  // Convert the grouped events object into a list of EventDays
  const eventDays = Object.entries(eventDayObj).map(
    ([date, dailyEvents]) => new EventDay(date, dailyEvents)
  );

  // Sort event days by their date
  return _.sortBy(eventDays, ({ date }) => moment(date).toDate());
}

/**
 * @param {Event[]} events A list of events
 * @returns A list of all events that are currently underway
 * TODO: potentially order the events by popularity? By end time?
 */
export function computeOngoingEvents(events) {
  const now = moment();
  const ongoingEvents = events.filter(event =>
    now.isBetween(event.startTime, event.endTime, "minute", "[]")
  );

  return _.sortBy(ongoingEvents, "endTime");
}

/**
 * @param {Event[]} events A list of events
 * @returns {Event[]} The events with the highest point values
 */
export function computeFeaturedEvents(events) {
  return _.orderBy(events, "pointValue", "desc");
}

/**
 * @param {Event[]} events A list of events
 * @param {Object} followCounts An object mapping event ids to the number of followers
 * @returns {Event[]} The sorted based on their follow counts in descending order
 */
export function computePopularEvents(events, followCounts) {
  return _.orderBy(events, event => followCounts[event.id], "desc");
}
