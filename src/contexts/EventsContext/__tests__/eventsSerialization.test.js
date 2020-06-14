import { it, expect, jest, describe, beforeEach } from "@jest/globals";
import * as ReactNative from "react-native";
import {
  serializationInfo,
  saveFieldState,
  restoreState,
} from "../eventsSerialization";
import mockFlattenedSchedule from "../../../mockData/mockFlattenedSchedule";
import { processRawEvents, computeExtraEventData } from "../eventUtils";
import mockFavoriteCounts from "../../../mockData/mockFavoriteCounts";
import { RESTORE_STATE, initialFieldState } from "../EventsReducer";

// Test data
const fields = ["events", "followCounts", "userFollowedEvents"];
const processedEvents = processRawEvents(mockFlattenedSchedule);
const sampleState = {
  events: {
    ...initialFieldState,
    data: processedEvents,
    ...computeExtraEventData(processedEvents),
  },
  followCounts: {
    ...initialFieldState,
    data: mockFavoriteCounts,
  },
  userFollowedEvents: {
    ...initialFieldState,
    data: new Set(mockFlattenedSchedule.slice(10, 20).map(event => event.id)),
  },
};

// Mocks
let asyncStore = {};
const { AsyncStorage } = ReactNative;
jest.spyOn(AsyncStorage, "setItem").mockImplementation(async (key, val) => {
  asyncStore[key] = val;
});
jest.spyOn(AsyncStorage, "getItem").mockImplementation(async key => {
  return asyncStore[key];
});
jest.spyOn(console, "warn");
const dispatch = jest.fn();

// Utilities
const getFieldData = field => {
  const { isLoading, errorMessage, ...fieldData } = sampleState[field];
  return fieldData;
};

// Clear the async store before each test
beforeEach(() => {
  asyncStore = {};
  console.warn.mockClear();
});

describe("saveFieldState", () => {
  it("Saves serialized data to the correct key for a given field", () => {
    fields.forEach(field => {
      const { serialize, key } = serializationInfo[field];
      const fieldData = getFieldData(field);

      saveFieldState(field, fieldData).then(() =>
        expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
          key,
          serialize(fieldData)
        )
      );
    });
  });

  it("Warns when it is unable to save the field state due to a phone error", async () => {
    console.warn.mockImplementationOnce(() => ({}));
    AsyncStorage.setItem.mockImplementationOnce(async () => {
      throw new Error("Phone error");
    });

    const field = "events";
    const { isLoading, errorMessage, ...fieldData } = sampleState[field];
    await saveFieldState(field, fieldData);

    expect(console.warn).toHaveBeenCalled();
  });
});

describe("restoreState", () => {
  it("Dispatches a RESTORE_STATE action containing the frozen state to the dispatcher", async () => {
    // Save all sample state into async storage
    await Promise.all(
      fields.map(field => saveFieldState(field, getFieldData(field)))
    );

    await restoreState(dispatch);

    expect(dispatch).toHaveBeenLastCalledWith({
      type: RESTORE_STATE,
      restoredState: sampleState,
    });

    // There should have been no errors
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("Doesn't set a value for any field that it can't retreive from storage", async () => {
    // Save only the first two fields into async storage
    await Promise.all(
      fields
        .slice(0, 2)
        .map(field => saveFieldState(field, getFieldData(field)))
    );
    await restoreState(dispatch);

    expect(dispatch).toHaveBeenLastCalledWith({
      type: RESTORE_STATE,
      restoredState: {
        [fields[0]]: sampleState[fields[0]],
        [fields[1]]: sampleState[fields[1]],
      },
    });

    // There should have been no errors
    expect(console.warn).not.toHaveBeenCalled();
  });
});
