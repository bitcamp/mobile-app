import _ from "lodash";
import { FETCH_START, FETCH_FAILURE, FETCH_SUCCESS } from "./EventsReducer";
import mockFetch from "../../mockData/mockFetch";

const returnSelf = data => data;
const returnEmptyObj = () => ({});

/**
 * Fetches a resource used by the event provider. Automatically handles the reducer state
 * handling during the fetch call.
 * @param {Function} dispatch The dispatch function for the reducer
 * @param {Object} options Additional options for the function (described below)
 * @param {string} options.field The field the reducer should be updating
 * @param {string} options.url The location of the data you want
 * @param {*} [options.desiredData = null] The data that you would like mockFetch to return
 * (TODO: delete in production)
 * @param {Object} options.fetchOptions Any options for the fetch call
 * @param {Function} [options.postProcess = (rawData) => rawData] Function to run on the processed data
 * @param {Function} [options.getComputedData = (rawData) => Object] Function to calculate any additional
 * values included in the field (e.g., events.sorted)
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
  }
) {
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
    // data field and )
    const action = { type: FETCH_SUCCESS, field };
    if (shouldUpdateData) {
      action.data = data;
      action.computedData = getComputedData(rawData);
    }
    dispatch(action);

    return true;
  } catch (e) {
    dispatch({
      type: FETCH_FAILURE,
      field,
      errorMsg: e.message.includes("JSON.parse")
        ? `Parsing error: ${url} doesn't return valid JSON data`
        : `Unable to fetch ${url}`,
    });

    return false;
  }
}

/**
 * Turns a list of events into an object that maps event ids to event objects
 * @param {Event[]} rawEvents A list of events
 * @returns {Object} a processed object mapping of event ids to event objects
 */
export function processRawEvents(rawEvents) {
  const newEventsObj = {};

  rawEvents.forEach(event => {
    newEventsObj[event.id] = event;
  });

  return newEventsObj;
}

/**
 * Computes additional data that should be stored inside the `events` field.
 * @param {Event[]} rawEvents A list of raw events
 */
export function computeExtraEventData(rawEvents) {
  const sortedEvents = computeSortedEvents(rawEvents);

  return {
    days: computeEventDays(sortedEvents),
    sorted: sortedEvents,
  };
}

/**
 * @param {Event[]} events A list of events
 * @returns {Event[]} a list of events sorted by their start times
 */
export function computeSortedEvents(events) {
  return events.sort((event1, event2) => {
    const startDiff = event1.startTime - event2.startTime;

    return startDiff === 0 ? event1.endTime - event2.endTime : startDiff;
  });
}

/**
 * @param {Event[]} events A list of events
 * @returns {Event[]} The events with the highest point values
 */
export function computeFeaturedEvents(events) {
  return events.sort((event1, event2) => event1.points - event2.points);
}

/**
 * @param {Event[]} events A list of events
 * @param {Object} followCounts An object mapping event ids to the number of followers
 * @returns {Event[]} The sorted based on their follow counts
 */
export function computePopularEvents(events, followCounts) {
  return events.sort(
    (event1, event2) => followCounts[event1.id] - followCounts[event2.id]
  );
}

/**
 * Groups events by their start date and their start time.
 * @param {Event[]} events A list of events
 * @returns {Object} An object that maps a day of the week (e.g., "Friday") to a list of objects.
 * Each inner object has the shape
 * {
 *  time: string, // Ex: "5:00 PM"
 *  data: Event[]
 * }
 */
export function computeEventDays(events) {
  // Group all of the events based on their day
  const eventDays = _.groupBy(events, getDay);

  const days = Object.keys(eventDays);

  // Group each event day based on the time of day
  days.forEach(day => {
    const dailyEvents = eventDays[day];
    const eventsByTime = _.groupBy(dailyEvents, getTimeOfDay);

    eventDays[day] = Object.entries(eventsByTime).map(
      ([time, eventsAtThisTime]) => ({
        time,
        data: eventsAtThisTime,
      })
    );
  });

  return eventDays;
}

/**
 * @param {Event} event An event object
 * @param {moment} event.startTime The start time of the event, as a moment
 * @returns {string} which weekday the event starts (e.g., "Friday")
 */
export function getDay(event) {
  return event.startTime.format("dddd");
}

/**
 * @param {Event} event An event object
 * @param {moment} event.startTime The start time of the event, as a moment
 * @returns {string} The hour in which the the event starts (e.g., "5:00 PM")
 */
export function getTimeOfDay(event) {
  return event.startTime.format("h:mm A");
}
