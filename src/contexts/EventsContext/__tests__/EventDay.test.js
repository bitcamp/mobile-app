import { it, expect } from "@jest/globals";
import moment from "moment";
import _ from "lodash";
import EventDay from "../EventDay";
import {
  fridayTestEvents,
  saturdayTestEvents,
} from "../../../mockData/mockFlattenedSchedule";
import { getDay } from "../timeUtils";

it("Splits the provided events based on time", () => {
  const friday = moment("2020-06-12");
  const expectedEventDays = {
    date: friday,
    eventGroups: [
      {
        time: "5:00 AM",
        data: [{ id: 1, startTime: moment("2020-06-12 05:00") }],
      },
      {
        time: "1:00 PM",
        data: [{ id: 2, startTime: moment("2020-06-12 13:00") }],
      },
      {
        time: "5:00 PM",
        data: [
          { id: 3, startTime: moment("2020-06-12 17:00") },
          { id: 4, startTime: moment("2020-06-12 17:00") },
        ],
      },
      {
        time: "5:30 PM",
        data: [
          { id: 5, startTime: moment("2020-06-12 17:30") },
          { id: 6, startTime: moment("2020-06-12 17:30:26") },
          { id: 7, startTime: moment("2020-06-12 17:30:59") },
        ],
      },
    ],
  };

  // Extract all event data into a flattened list
  const events = [];
  expectedEventDays.eventGroups.forEach(({ data }) => {
    events.push(...data);
  });

  expect(new EventDay(friday, events)).toEqual({
    ...expectedEventDays,
    eventGroups: expectedEventDays.eventGroups.map(({ time, data }) => ({
      time,
      data: data.map(event => event.id),
    })),
  });
});

it("Orders event times for a specific day in ascending order", () => {
  const events = _.shuffle(fridayTestEvents);
  const date = getDay(events[0].startTime);

  const friday = new EventDay(date, events);

  for (let i = 0; i < friday.eventGroups.length - 1; i += 1) {
    const curr = `2020-01-01 ${friday.eventGroups[i].time}`;
    const next = `2020-01-01 ${friday.eventGroups[i + 1].time}`;

    expect(new Date(curr) <= new Date(next)).toBeTruthy();
  }
});

it("Throws an error if it's given events that don't occur on the same day", () => {
  const date = fridayTestEvents[0].startTime;
  const events = [fridayTestEvents[0], saturdayTestEvents[0]];

  expect(() => new EventDay(date, events)).toThrow();
});
