import { describe, it, expect, jest } from "@jest/globals";
import {
  renderHook,
  act,
  waitForNextUpdate,
} from "@testing-library/react-hooks";
import useCachedGetRequest from "./useCachedGetRequest";

// Mocks
jest.mock("../../utils/request.js");

describe("Caching policies", () => {
  const url = "abc.com";

  it("Hits the cache on mount", () => {});

  it("Updates the cache value whenever a get request is triggered", () => {});
});

describe("Get request", () => {
  it("Provides the fetched data as soon as it's ready", () => {});
});

describe("Options", () => {
  it("Post processes the data", () => {});
  it("Calls useQuery with custom variables", () => {});
  it("Merges query config values", () => {});
});
