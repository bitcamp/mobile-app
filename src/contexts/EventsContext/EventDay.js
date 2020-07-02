import _ from "lodash";
import moment from "moment";
import { getDay, getTimeOfDay, getWeekDay } from "../../utils/time";

/**
 * Holds onto all events for a particular day (e.g. 3/14/1592), grouping them based on start time
 */
export default class EventDay {
  constructor(date, events) {
    this.date = date;

    // Make sure all events are valid
    const dateAsStr = getDay(this.date);
    events.forEach(event => {
      const eventDateStr = getDay(event.startTime);
      if (eventDateStr !== dateAsStr) {
        throw new Error(
          `${event.toString()} starts on ${eventDateStr}, not the EventDay's date (${eventDateStr})`
        );
      }
    });

    this.groupEventsByTime(events);
  }

  /**
   * Segments the list of events into a list of times, and takes only the event ids
   */
  groupEventsByTime(events) {
    const eventsByTime = _.groupBy(events, event =>
      getTimeOfDay(event.startTime)
    );

    // Order the event groups in ascending order based on start time
    this.eventGroups = _.sortBy(
      Object.entries(eventsByTime),
      ([, [sampleEvent]]) => moment(sampleEvent.startTime).toDate()
    );

    // Map the list of object entries into objects with the shape {time: moment, data: event.id[]}
    this.eventGroups = this.eventGroups.map(([time, eventsAtThisTime]) => ({
      time,
      data: eventsAtThisTime,
    }));
  }

  /**
   * @returns the day of the week
   */
  get weekDay() {
    return getWeekDay(this.date);
  }
}
