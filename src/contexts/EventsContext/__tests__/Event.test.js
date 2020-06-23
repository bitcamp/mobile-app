import { describe, it, expect } from "@jest/globals";
import Event, { EVENT_SCHEMA } from "../Event";
import mockFlattenedSchedule from "../../../mockData/mockFlattenedSchedule";

const validationOptions = { strict: true, abortEarly: true };

/**
 * Tests whether setting any of the specified to one of the invalid values
 * yields an invalid event
 * @param {*[]} fieldsToCheck List of fields to test
 * @param {*[]} invalidValues List of bad values for the given fields
 */
const expectInvalidFieldValuesDontValidate = (fieldsToCheck, invalidValues) => {
  const validEvent = mockFlattenedSchedule[0];
  expect(EVENT_SCHEMA.isValidSync(validEvent)).toBe(true);

  fieldsToCheck.forEach(field => {
    invalidValues.forEach(badFieldVal => {
      const invalidEvent = { ...validEvent, [field]: badFieldVal };

      const isValid = EVENT_SCHEMA.isValidSync(invalidEvent, validationOptions);

      if (isValid) {
        // We're only using the console to improve the error reporting (this isn't production)
        // eslint-disable-next-line no-console
        console.error(
          `Expected an event with { ${field}: ${badFieldVal} } to be invalid, but it was valid`
        );
      }

      expect(isValid).toBe(false);
    });
  });
};

describe("Event Schema Validation", () => {
  it("Accepts valid event objects", () => {
    mockFlattenedSchedule.forEach(event => {
      expect(EVENT_SCHEMA.isValidSync(event, validationOptions)).toBe(true);
    });
  });

  it("Accepts event objects if optional fields are missing", () => {
    const validEvent = mockFlattenedSchedule[0];

    const optionalFields = ["description", "caption"];

    optionalFields.forEach(requiredField => {
      const stillValidEvent = { ...validEvent };
      delete stillValidEvent[requiredField];

      expect(EVENT_SCHEMA.isValidSync(stillValidEvent, validationOptions)).toBe(
        true
      );
    });
  });

  it("Accepts event objects with extra fields", () => {
    const validEvent = mockFlattenedSchedule[0];
    validEvent.extraField = "blah";

    expect(EVENT_SCHEMA.isValidSync(validEvent, validationOptions)).toBe(true);
  });

  it("Rejects an object missing any required field", () => {
    const validEvent = mockFlattenedSchedule[0];

    const requiredFields = [
      "id",
      "title",
      "startTime",
      "endTime",
      "location",
      "pointValue",
      "categories",
    ];

    requiredFields.forEach(requiredField => {
      const invalidEvent = { ...validEvent };
      delete invalidEvent[requiredField];

      expect(EVENT_SCHEMA.isValidSync(invalidEvent, validationOptions)).toBe(
        false
      );
    });
  });

  it("Rejects non-objects", () => {
    const invalidEvents = [
      null,
      undefined,
      1,
      "strings aren't objects",
      [],
      true,
      new Set(),
    ];

    invalidEvents.forEach(invalidEvent => {
      expect(EVENT_SCHEMA.isValidSync(invalidEvent, validationOptions)).toBe(
        false
      );
    });
  });

  it("Rejects events where the string fields aren't strings", () => {
    const notStrings = [null, 1, [], ["not a string"], true, {}];
    const stringFields = [
      "title",
      "startTime",
      "endTime",
      "location",
      "description",
      "caption",
    ];

    expectInvalidFieldValuesDontValidate(stringFields, notStrings);
  });

  it("Rejects objects where the `pointValue` or `id` fields aren't positive integers", () => {
    const notNumbers = [
      null,
      undefined,
      "no num",
      [],
      [1],
      true,
      {},
      -1,
      -1.5,
      "1",
      1.5,
      NaN,
    ];
    expectInvalidFieldValuesDontValidate(["pointValue", "id"], notNumbers);
  });

  it("Rejects objects where `categories` isn't an array", () => {
    const notArrays = [null, undefined, "no num", true, {}, []];
    expectInvalidFieldValuesDontValidate(["categories"], notArrays);
  });

  it("Rejects objects where `categories` is an empty array", () => {
    expectInvalidFieldValuesDontValidate(["categories"], [[]]);
  });

  it("Rejects objects where `categories` isn't an array of valid category strings ('main' | 'food' | 'mini' | 'workshop' | 'sponsored')", () => {
    const invalidCategories = [
      ["not a real category"],
      ["main", "not a real category"],
      ["main", undefined],
      [undefined],
      [1, "sponsored"],
      ["Main"],
      ["MAIN"],
      ["MAIN", "sponsored"],
    ];
    expectInvalidFieldValuesDontValidate(["categories"], invalidCategories);
  });

  it("Rejects objects where startTime/endTime are not ISO 8601 date strings", () => {
    const invalidTimes = [
      "10:00 AM", // Just a time
      "2020-12-32", // Invalid day
      "2020-13-20", // Invalid month
      "2020-12-12 9:00", // Should be 09:00
      "2020-12-12 01:00 AM", // Shouldn't have AM
      "2020-12-12 01:00 PM", // Shouldn't have PM
      "20-12-12", // Year not fully specified
    ];
    expectInvalidFieldValuesDontValidate(
      ["startTime", "endTime"],
      invalidTimes
    );
  });
});

describe("Event Schema cast", () => {
  it("Sets proper default values for description and caption when they are ommitted", () => {
    const { description, caption, ...event } = mockFlattenedSchedule[0];

    expect(EVENT_SCHEMA.cast(event)).toEqual({
      ...mockFlattenedSchedule[0],
      description: "",
      caption: "",
    });
  });
});

describe("new Event()", () => {
  it("Assigns all fields properly when given a valid event object", () => {
    const eventObj = {
      id: 1,
      title: "My Cool event",
      description: "description here",
      caption: "caption here",
      location: "location here",
      startTime: "2020-06-21 12:00",
      endTime: "2020-06-21 13:00",
      categories: ["main", "sponsored", "workshop", "food"],
      pointValue: 10,
    };

    expect(new Event(eventObj)).toEqual(eventObj);
    expect(new Event(eventObj)).toEqual(eventObj);
  });

  it("event.startTimeFormatted returns a time in the form hh:mm a", () => {
    const eventObj = {
      ...mockFlattenedSchedule[0],
      startTime: "2020-06-21 13:00:12",
    };

    expect(new Event(eventObj).startTimeFormatted).toBe("1:00 PM");
  });

  it("event.endTimeFormatted returns a time in the form hh:mm a", () => {
    const eventObj = {
      ...mockFlattenedSchedule[0],
      endTime: "2020-06-21 05:31:21.00",
    };

    expect(new Event(eventObj).endTimeFormatted).toBe("5:31 AM");
  });

  it("event.timeRange returns a string showing 'startTimeFormatted - endTimeFormatted", () => {
    const eventObj = {
      ...mockFlattenedSchedule[0],
      startTime: "2020-06-21 20:31:21.00",
      endTime: "2020-06-21 22:48:33.00",
    };

    expect(new Event(eventObj).timeRange).toBe("8:31 PM - 10:48 PM");
  });

  it("event.timeRange just returns a formatted time string when the start and end time are equal", () => {
    const eventObj = {
      ...mockFlattenedSchedule[0],
      startTime: "2020-06-21 22:49:33.00",
      endTime: "2020-06-21 22:49:33.00",
    };

    expect(new Event(eventObj).timeRange).toBe("10:49 PM");
  });
});
