import moment from "moment";
import _ from "lodash";
import Event from "./Event";
import EventGroup from "./EventGroup";
import EventDay from "./EventDay";
import { normalizeTimeLabel } from "../contexts/EventsContext/timeUtils";

const bannerMap = {
  opening_ceremony: "ceremony",
  closing_ceremony: "ceremony",
  expo_a: "demo",
  expo_b: "demo",
  colorwar: "colorwar",
};

// creates an EventGroup object from a collection of event json entries
// which have already been grouped
export function createEventGroup(eventGroupLabel, rawEventArray) {
  const eventArray = rawEventArray.map(rawEvent => {
    const title = rawEvent.title.toLowerCase().replace(" ", "_");
    const img = `banner_${
      bannerMap[title] !== undefined
        ? bannerMap[title]
        : (Array.isArray(rawEvent.category)
            ? rawEvent.category[0]
            : rawEvent.category
          ).toLowerCase()
    }`;

    return new Event(
      rawEvent.eventID,
      rawEvent.title,
      rawEvent.category,
      rawEvent.caption,
      rawEvent.description,
      rawEvent.startTime,
      rawEvent.endTime,
      rawEvent.featuredEvent,
      rawEvent.location,
      img
    );
  });

  return { title: eventGroupLabel, data: eventArray };
}

// creates an EventDay object from an array of event json entries
export function createEventDay(rawEventDay) {
  const dayLabel = rawEventDay[0];
  const sortedEvents = rawEventDay[1].sort((event1, event2) => {
    const start1 = moment(event1.startTime);
    const start2 = moment(event2.startTime);

    const end1 = moment(event1.endTime);
    const end2 = moment(event2.endTime);

    if (start1 - start2 === 0) {
      return end1 - end2;
    }

    return start1 - start2;
  });

  const groupedData = _.groupBy(sortedEvents, event => {
    return normalizeTimeLabel(event.startTime);
  });

  const eventGroupLabels = Object.keys(groupedData);

  const eventGroupObjs = eventGroupLabels.map(label =>
    createEventGroup(label, groupedData[label])
  );

  return new EventDay(dayLabel, eventGroupObjs);
}
