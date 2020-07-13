import _ from "lodash";
import moment from "moment";
import EventDay from "../../common/models/EventDay";
import { getDay } from "../../common/utils/time";
import Event, { EVENT_SCHEMA } from "../../common/models/Event";

/**
 * Turns a list of events into an object that maps event ids to event objects
 * @param {object[]} rawEvents A list of raw event objects
 * @throws if the event data for ALL events is malformed.
 * @returns {object} an object with the shape `{ list, byId, days }` which all contain
 * Event objects with any invalid events removed
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

  return {
    list: processedEvents,
    byId: computeIdToEventMap(processedEvents),
    days: computeEventDays(processedEvents),
  };
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
