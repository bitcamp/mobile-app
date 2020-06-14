import { describe, it, expect } from "@jest/globals";
import moment from "moment";
import { getTimeOfDay, getDay, getWeekDay } from "../timeUtils";

describe("getTimeOfDay", () => {
  it("Works with arbitrary times of day", () => {
    const times = ["3:00 PM", "7:30 PM", "12:00 AM", "12:00 PM", "8:45 AM"];

    const timesAsMoments = times.map(time =>
      moment(`01/15/20 ${time}`, "MM/DD/YY hh:mm a")
    );

    timesAsMoments.forEach((time, i) => {
      expect(getTimeOfDay(time)).toBe(times[i]);
    });
  });
});

describe("getWeekDay", () => {
  it("Handles all days of the week", () => {
    const week = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    for (let weekDay = 1; weekDay <= 7; weekDay += 1) {
      const dayStr = getWeekDay(moment().isoWeekday(weekDay));

      expect(dayStr).toBe(week[weekDay - 1]);
    }
  });
});

describe("getDay", () => {
  it("Correctly formats valid days", () => {
    const timeToExpectedMap = {
      "2020-06-21": "2020-06-21",
      "2021-07-22 01": "2021-07-22",
      "2020-08-23 01:20": "2020-08-23",
      "2020-01-01 13:30:30.21": "2020-01-01",
    };

    Object.entries(timeToExpectedMap).forEach(([time, expectedStr]) => {
      expect(getDay(time)).toBe(expectedStr);
    });
  });
});
