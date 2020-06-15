import { describe, expect, it, jest } from "@jest/globals";
import moment from "moment";
import _ from "lodash";
import * as ReactNative from "react-native";
import mockFetch from "../../../mockData/mockFetch";
import {
  computeEventDays,
  computeExtraEventData,
  computePopularEvents,
  computeIdToEventMap,
  processRawEvents,
  computeOngoingEvents,
  computeFeaturedEvents,
  providerFetch,
} from "../eventUtils";
import {
  fridayTestEvents,
  saturdayTestEvents,
  sundayTestEvents,
} from "../../../mockData/mockFlattenedSchedule";
import mockFavoriteCounts from "../../../mockData/mockFavoriteCounts";
import Event from "../Event";
import { FETCH_START, FETCH_SUCCESS, FETCH_FAILURE } from "../EventsReducer";

// Test data
const jsonData = { someData: "blah" };
const successfulFetch = {
  ok: true,
  json: async () => jsonData,
};
const testEvents = [
  ...fridayTestEvents.slice(0, 3),
  ...saturdayTestEvents.slice(0, 2),
];

// Mocks
jest.mock("../../../mockData/mockFetch");
mockFetch.mockResolvedValue(successfulFetch);
Date.now = jest.fn(); // Used to adjust the date returned by `moment()`
const dispatch = jest.fn();
const postProcess = jest.fn();
const getComputedData = jest.fn();
const { AsyncStorage } = ReactNative;
jest.spyOn(AsyncStorage, "setItem");
jest.spyOn(console, "warn");

/**
 * Checks if the given function properly handles empty lists and doesn't modify the input list
 * @param {(Event[]) => *} func The function to test
 * @param {Object} [options = {}] Extra test options (see implemented options below)
 * @param {*} [options.emptyListReturnVal = []] The expected return value of the function when given an empty list
 * @param {*[]} [options.extraParams = []] A list of extra parameters used by the function
 */
const commonEventFunctionTests = (
  func,
  { emptyListReturnVal = [], extraParams = [] } = {}
) => {
  it(`Returns ${emptyListReturnVal} when given an empty list`, () => {
    expect(func([], ...extraParams)).toEqual(emptyListReturnVal);
  });

  it("Doesn't modify the supplied events list", () => {
    func(testEvents, ...extraParams);
    expect(testEvents).toEqual(testEvents);
  });
};

describe("providerFetch", () => {
  const url = "abc.com";
  const field = "events";

  it("Throws an error if the `dispatch`, `url`, or `field` arguments are missing", async () => {
    const errorStr = "Missing the required parameters";

    await expect(providerFetch()).rejects.toThrow(errorStr);
    await expect(providerFetch(dispatch, { url })).rejects.toThrow(errorStr);
    await expect(providerFetch(dispatch, { field })).rejects.toThrow(errorStr);
  });

  it("Returns true on success, false on failure/error", async () => {
    // Fetch succeeded
    mockFetch.mockResolvedValueOnce(successfulFetch);
    await expect(providerFetch(dispatch, { url, field })).resolves.toBe(true);

    // Fetch failed
    mockFetch.mockResolvedValueOnce({ ...successfulFetch, ok: false });
    await expect(providerFetch(dispatch, { url, field })).resolves.toBe(false);

    // Fetch errored
    mockFetch.mockImplementationOnce(async () => {
      throw new Error();
    });
    await expect(providerFetch(dispatch, { url, field })).resolves.toBe(false);
  });

  it("Calls fetch with the correct parameters", () => {
    const fetchParams = [url, "someDesiredData", { someFetchOption: "value" }];
    providerFetch(dispatch, {
      field,
      url,
      desiredData: fetchParams[1],
      fetchOptions: fetchParams[2],
    });

    expect(mockFetch).toHaveBeenCalledWith(...fetchParams);
  });

  it("Dispatches a FETCH_START before fetching", async () => {
    dispatch.mockClear();
    mockFetch.mockClear();

    await providerFetch(dispatch, { url, field });

    expect(dispatch).toHaveBeenNthCalledWith(1, { type: FETCH_START });

    const firstDispatchCall = dispatch.mock.invocationCallOrder[0];
    const firstFetchCall = mockFetch.mock.invocationCallOrder[0];

    expect(firstDispatchCall).toBeLessThan(firstFetchCall);
  });

  it("Dispatches a valid FETCH_SUCCESS action if fetching is successful", async () => {
    await providerFetch(dispatch, { url, field });

    expect(dispatch).toHaveBeenLastCalledWith({
      type: FETCH_SUCCESS,
      field,
      payload: {
        data: jsonData,
      },
    });
  });

  it("Dispatches a FETCH_FAILURE with the proper payload if response.ok is false", async () => {
    mockFetch.mockResolvedValueOnce({ ...successfulFetch, ok: false });
    await providerFetch(dispatch, { url, field });

    expect(dispatch).toHaveBeenLastCalledWith({
      type: FETCH_FAILURE,
      field,
      errorMessage: expect.stringContaining("Unable to fetch"),
    });
  });

  it("Dispatches a FETCH_FAILURE if JSON parsing fails", async () => {
    // Simulate a json parsing error
    mockFetch.mockResolvedValueOnce({
      ...successfulFetch,
      json: async () => {
        throw new Error("JSON.parse");
      },
    });

    await providerFetch(dispatch, { url, field });

    expect(dispatch).toHaveBeenLastCalledWith({
      type: FETCH_FAILURE,
      field,
      errorMessage: expect.stringContaining("Parsing error"),
    });
  });

  it("Postprocesses data when given a `postProcess()` callback", async () => {
    const processedData = Math.random();
    postProcess.mockReturnValueOnce(processedData);

    await providerFetch(dispatch, { url, field, postProcess });

    expect(postProcess).toHaveBeenLastCalledWith(jsonData);
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        payload: {
          data: processedData,
        },
      })
    );
  });

  it("Adds extra data to the action when given a `getComputedData()` callback", async () => {
    const extraData = { someKey: Math.random() };
    getComputedData.mockReturnValueOnce(extraData);

    await providerFetch(dispatch, {
      url,
      field,
      getComputedData,
    });

    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        payload: {
          data: expect.anything(),
          ...extraData,
        },
      })
    );
  });

  it("Passes the post processed data to the `getComputedData()` callback ", async () => {
    const processedData = Math.random();
    const extraData = Math.random();
    postProcess.mockReturnValueOnce(processedData);
    getComputedData.mockReturnValueOnce(extraData);

    await providerFetch(dispatch, {
      url,
      field,
      postProcess,
      getComputedData,
    });

    expect(getComputedData).toHaveBeenLastCalledWith(processedData);
  });

  it("Only adds a payload to the FETCH_SUCCESS action when `shouldUpdateData` is true", async () => {
    // Returns a payload when shouldUpdateData is true
    await providerFetch(dispatch, { url, field, shouldUpdateData: true });
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        payload: expect.anything(),
      })
    );

    // Returns a minimal action when shouldUpdateData is false
    await providerFetch(dispatch, {
      url,
      field,
      shouldUpdateData: false,
      getComputedData,
    });
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.not.objectContaining({
        payload: expect.anything(),
      })
    );
  });

  it("Only saves the field state in async storage if `shouldUpdateData` is true", async () => {
    AsyncStorage.setItem.mockClear();
    await providerFetch(dispatch, { url, field, shouldUpdateData: true });

    expect(AsyncStorage.setItem).toHaveBeenCalled();

    AsyncStorage.setItem.mockClear();
    await providerFetch(dispatch, { url, field, shouldUpdateData: false });

    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it("Still throws a fetch success if the AsyncStorage call fails", async () => {
    AsyncStorage.setItem.mockImplementationOnce(async () => {
      throw new Error("Whoopsies :(");
    });

    // Ignore any console warnings when setItem fails is called
    console.warn.mockImplementationOnce(() => {});

    await providerFetch(dispatch, { url, field });

    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: FETCH_SUCCESS,
      })
    );
  });
});

describe("processRawEvents", () => {
  const invalidEvents = [
    undefined,
    null,
    10,
    "strings aren't events :(",
    "",
    {
      id: 10,
    },
    {
      ...fridayTestEvents[0],
      id: "string ids are invalid",
    },
    {
      ...fridayTestEvents[0],
      description: {
        blah: "description should be a string, not an object",
      },
    },
  ];

  // Pick some selection of test events
  const validEvents = [
    ...fridayTestEvents.slice(0, 10),
    ...saturdayTestEvents.slice(10, 23),
    ...sundayTestEvents.slice(1, 9),
  ];

  it("Throws an error when events are provided, but none are valid", () => {
    expect(() => {
      processRawEvents(invalidEvents);
    }).toThrow("No events passed validation");
  });

  it("Return only the valid events when given a mix of valid and invalid events", () => {
    const processedEvents = processRawEvents(
      _.shuffle([...invalidEvents, ...validEvents])
    );

    expect(processedEvents.length).toEqual(validEvents.length);
    expect(processedEvents).toEqual(expect.arrayContaining(validEvents));
  });

  it("Sets event.description = '' and event.caption = '' when those fields are ommitted", () => {
    const { description, ...noDescription } = validEvents[0];
    const { caption, ...noCaption } = validEvents[0];

    expect(processRawEvents([noDescription])[0].description).toEqual("");
    expect(processRawEvents([noCaption])[0].caption).toEqual("");
  });
});

describe("computeIdToEventMap", () => {
  commonEventFunctionTests(computeIdToEventMap, { emptyListReturnVal: {} });

  it("Maps event ids to their respective events", () => {
    const idToEventMap = computeIdToEventMap(testEvents);

    expect(Object.keys(idToEventMap).length).toBe(testEvents.length);

    testEvents.forEach(event => {
      expect(idToEventMap[event.id]).toEqual(event);
    });
  });
});

describe("computeEventDays", () => {
  commonEventFunctionTests(computeEventDays);

  it("Orders event days by date", () => {
    const orderedEventObj = {
      // Friday
      "2020-06-12": [
        { id: 1, startTime: moment("2020-06-12 01:00"), blah: "blah" },
        { id: 2, startTime: moment("2020-06-12 01:00"), test: 1 },
      ],
      // Saturday
      "2020-06-13": [{ startTime: moment("2020-06-13 01:00") }],
      // Next Monday
      "2020-06-15": [
        { id: 3, startTime: moment("2020-06-15 01:00") },
        { id: 4, startTime: moment("2020-06-15 01:00"), extraParam: 20 },
        { id: 5, startTime: moment("2020-06-15 01:00"), blurg: 18 },
      ],
    };

    const unorderedEvents = [
      ...orderedEventObj["2020-06-13"],
      ...orderedEventObj["2020-06-15"],
      ...orderedEventObj["2020-06-12"],
    ];

    const eventDays = computeEventDays(unorderedEvents);

    // Make sure the dates are in order and preserve internal properties of the event objects
    Object.entries(orderedEventObj).forEach(([date, events], i) => {
      expect(moment(eventDays[i].date)).toEqual(moment(date));
      expect(eventDays[i].eventGroups[0].data).toEqual(events);
    });
  });
});

describe("computeExtraEventData", () => {
  it("Computes the appropriate event data object without any extra keys", () => {
    // If `computeEventDays()` are both functional, so is this funciton
    const eventObj = processRawEvents(testEvents);
    expect(computeExtraEventData(eventObj)).toEqual({
      days: computeEventDays(testEvents),
      byId: computeIdToEventMap(testEvents),
    });
  });
});

describe("computePopularEvents", () => {
  // Try the default test using a dummy version of the follow
  commonEventFunctionTests(computePopularEvents, {
    extraParams: [mockFavoriteCounts],
  });

  it("Sorts a list of events in ascending order by follow count", () => {
    // Create a list of events with ids in ascending order
    const events = [{ id: 1 }, { id: 10 }, { id: 20 }, { id: 25 }];

    // The smaller your id, the larger your follow count
    // (This setup means that the above events array is already sorted in ascending order)
    const followCount = {};
    events.forEach(event => {
      followCount[event.id] = (25 - event.id) * 2;
    });

    // Permute the events
    const unorderedEvents = [events[3], events[2], events[0], events[1]];

    const orderedByPopularity = computePopularEvents(
      unorderedEvents,
      followCount
    );

    expect(orderedByPopularity).toEqual(events);
  });
});

describe("computeOngoingEvents", () => {
  commonEventFunctionTests(computeOngoingEvents);

  const currTime = new Date("2020-01-02 9:21");
  const ongoingTestEvents = [
    { startTime: "2020-01-02 09:00", endTime: "2020-01-02 10:00" },
    { startTime: "2020-01-02 09:00", endTime: "2020-01-02 09:30" },
    { startTime: "2020-01-02 09:21", endTime: "2020-01-02 09:21" }, // start = end = currTime
    { startTime: "2020-01-01 10:00", endTime: "2020-01-02 09:30" }, // start = day before
    { startTime: "2020-01-02 09:20:59", endTime: "2020-01-02 09:21:01" }, // accurate to the second
  ];

  const notOngoingEvents = [
    { startTime: "2020-01-01 09:00", endTime: "2020-01-01 10:00" }, // Different day
    { startTime: "2020-01-02 09:22", endTime: "2020-01-02 09:23" }, // minute after
    { startTime: "2020-01-02 09:21", endTime: "2020-01-02 09:19" }, // end < start
    { startTime: "2020-01-02 20:00", endTime: "2020-01-02 22:00" }, // start < 9PM < end (not 9AM)
    { startTime: "2020-01-02 10:00", endTime: "2020-01-02 11:00" }, // Random time
  ];

  const allTestEvents = [...ongoingTestEvents, ...notOngoingEvents];

  it("Returns every ongoing event and rejects all others", () => {
    Date.now.mockReturnValueOnce(currTime);
    const ongoingEvents = computeOngoingEvents(allTestEvents);

    expect(ongoingEvents.length).toBe(ongoingTestEvents.length);
    expect(ongoingEvents).toEqual(expect.arrayContaining(ongoingEvents));
  });

  it("Sorts events in ascending order based on end time", () => {
    Date.now.mockReturnValueOnce(currTime);
    const ongoingEvents = computeOngoingEvents(allTestEvents);

    for (let i = 0; i < ongoingEvents.length - 1; i += 1) {
      expect(
        moment(ongoingEvents[i].endTime).isSameOrBefore(
          ongoingEvents[i + 1].endTime
        )
      ).toBeTruthy();
    }
  });
});

describe("computeFeaturedEvents", () => {
  commonEventFunctionTests(computeFeaturedEvents);

  it("Sorts events in descending order by point value", () => {
    // Make some events with different point values
    // Some events should have the same point values
    const dupVal = 50;
    const events = [...Array(30).keys()].map(i => ({
      pointValue: i % 5 === 0 ? dupVal : i,
    }));

    const featuredEvents = computeFeaturedEvents(_.shuffle(events));

    for (let i = 0; i < featuredEvents.length - 1; i += 1) {
      expect(featuredEvents[i].pointValue).toBeGreaterThanOrEqual(
        featuredEvents[i + 1].pointValue
      );
    }
  });
});
