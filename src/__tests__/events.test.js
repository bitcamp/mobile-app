import { describe, expect, it, fail } from "@jest/globals";
import moment from "moment";
import { getDay } from "../contexts/EventsContext/eventUtils";

describe("Event Utils", () => {
  describe("providerFetch", () => {});

  describe("processRawEvents", () => {});

  describe("computeExtraEventData", () => {});

  describe("computeSortedEvents", () => {});

  describe("computeFeaturedEvents", () => {});

  describe("computePopularEvents", () => {});

  describe("computeEventDays", () => {});

  describe("getTimeOfDay", () => {
    it("Gets the correct time of day", () => {
      const 
    });
  });

  describe("getDay", () => {
    it("Works with all days of the week", () => {
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
        const eventObj = {
          startTime: moment().isoWeekday(weekDay),
        };
        const dayStr = getDay(eventObj);
        expect(dayStr).toBe(week[weekDay - 1]);
      }
    });
  });
});

describe("Event Reducer", () => {
  it("Has a valid initial state", () => {
    fail("Test not implemented");
  });

  it("Correctly restores data from AsyncStorage when it's there", () => {
    fail("Test not implemented");
  });

  it("Stops trying to restore data from AsyncStorage when it's not there", () => {
    fail("Test not implemented");
  });
});
