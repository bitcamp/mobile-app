import mockFetch from "../mockData/mockFetch";
import { BASE_URL } from "../../api.config";

/**
 * Makes an HTTP request using the `fetch()` web API, returns the data. Automatically checks
 * the response status and parses the response data.
 *
 * @param {string} routeOrURL The location of the data you want, either as a URL (e.g. 'abc.com')
 * or a simple route (e.g. '/blah'). Routes will always start with a `/` and will be
 * prepended by the BASE_URL as defined in `src/api.config.js`. (REQUIRED)
 * @param {Object} options Options to be used by `fetch()`, along with extra configurations
 * for this function.
 * @param {any} [options.responseData = null] The data that you would like mockFetch to return
 * (TODO: delete in production)
 * @param {string} [options.accessToken] A token used to authenticate a request. Only needed for
 * routes that require users to be logged in.
 * @returns True if the fetch succeeded, false otherwise
 */
export default async function request(routeOrURL, options = {}) {
  const { accessToken, ...fetchOptions } = options;

  if (!routeOrURL) {
    throw new Error(
      `The URL to fetch must be a string, received ${routeOrURL}`
    );
  }

  const url = routeOrURL[0] === "/" ? `${BASE_URL}${routeOrURL}` : routeOrURL;

  if (fetchOptions.headers && fetchOptions.headers["access-token"]) {
    throw new Error(
      "Don't set the access token using raw headers. Instead, pass it in as an option to `request()`"
    );
  }

  // Set access token appropriately
  if (accessToken) {
    fetchOptions.headers = {
      ...(fetchOptions.headers || {}),
      "access-token": accessToken,
    };
  }

  const response = await mockFetch(url, fetchOptions);

  // Handle errors that fetch doesn't typically catch
  if (!response.ok) {
    throw new Error(`Received HTTP ${response.status} while fetching ${url}`);
  }

  try {
    return await response.json();
  } catch (e) {
    throw new Error(`Unable to parse JSON for ${url}: ${e.message}`);
  }
}
