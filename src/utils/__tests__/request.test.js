import { describe, it, expect, jest } from "@jest/globals";
import request from "../request";
import mockFetch from "../../mockData/mockFetch";
import { BASE_URL } from "../../api.config";

// Test data
const jsonData = { someData: "blah" };
const successfulFetch = {
  ok: true,
  json: async () => jsonData,
  status: 200,
};

// Mocks
jest.mock("../../mockData/mockFetch");
mockFetch.mockResolvedValue(successfulFetch);

describe("request()", () => {
  const url = "abc.com";

  it("Returns the JSON-parsed data on success", async () => {
    mockFetch.mockResolvedValueOnce(successfulFetch);
    await expect(request(url)).resolves.toEqual(jsonData);
  });

  it("Throws an error if the `url` argument is missing", async () => {
    await expect(request()).rejects.toThrow("The URL must be a string");
  });

  it("Throws an error if the fetch call throws one", async () => {
    mockFetch.mockImplementationOnce(async () => {
      throw new Error("Some network error");
    });
    await expect(request(url)).rejects.toThrow("Some network error");
  });

  it("Throws an error if response.ok is false", async () => {
    mockFetch.mockResolvedValueOnce({
      ...successfulFetch,
      ok: false,
      status: 404,
    });
    await expect(request(url)).rejects.toThrow("404");
  });

  it("Throws an error if the returned data isn't valid JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ...successfulFetch,
      json: async () => {
        throw new Error("JSON parsing error");
      },
    });
    await expect(request(url)).rejects.toThrow("JSON parsing error");
  });

  it("Calls `fetch()` with the correct parameters (url and options)", async () => {
    const options = { desiredData: "blah", someFetchOption: "value" };
    await request(url, options);

    expect(mockFetch).toHaveBeenLastCalledWith(url, options);
  });

  it("Doesn't call `fetch` with any of its custom options", async () => {
    const customOptions = {
      accessToken: "some access token",
    };
    const fetchOptions = {
      method: "GET",
      headers: {
        someHTTPHeader: "some value",
      },
    };

    await request(url, { ...customOptions, ...fetchOptions });

    expect(mockFetch).toHaveBeenLastCalledWith(
      url,
      expect.not.objectContaining(customOptions)
    );
  });

  it("Sets the correct header value when `options.accessToken` is provided", async () => {
    const accessToken = "some random JWT";
    const options = { blah: 1 };

    await request(url, { ...options, accessToken });

    expect(mockFetch).toHaveBeenLastCalledWith(url, {
      ...options,
      headers: { "access-token": accessToken },
    });
  });

  it("Doesn't override any other headers when  `options.accessToken` is provided", async () => {
    const accessToken = "some random JWT";
    const existingHeaders = { someHTTPHeader: "some value" };
    const options = { blah: 1, headers: existingHeaders };

    await request(url, { ...options, accessToken });

    expect(mockFetch).toHaveBeenLastCalledWith(url, {
      ...options,
      headers: { ...existingHeaders, "access-token": accessToken },
    });
  });

  it("Throws an error if the user manually sets the access-token header", async () => {
    const headers = { "access-token": "a manually-set token" };

    expect(request(url, { headers })).rejects.toThrow("access token");
    expect(request(url, { headers, accessToken: "blah" })).resolves.toThrow(
      "access token"
    );
  });

  it("When given a route as the first parameter, prepends the url with a BASE_URL", async () => {
    const route = "/some/random/route";
    await request(route);

    expect(mockFetch).toHaveBeenLastCalledWith(
      `${BASE_URL}${route}`,
      expect.anything()
    );
  });
});
