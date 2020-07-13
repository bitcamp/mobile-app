/**
 * A stand-in for the standard fetch() function that returns a barebones
 * API response using dummy data.
 *
 * TODO: phase this function out once the app's backend is setup
 *
 * @param {string} url The fetch location (currently unused)
 * @param {any} options.responseData The data you want the code to respond with
 * @param {object} options.responseHeaders The headers you want the code to respond with
 * @param {...object} options.fetchOptions The options for fetch (currently unused)
 * @returns a promise that returns a Response object with a 200 status.
 * To access the response data, call the `.json()` method
 */
export default async function mockFetch(url, options) {
  const { responseData = null, responseHeaders = {} } = options;

  return {
    json: async () => responseData,
    status: 200,
    statusText: "OK",
    ok: true,
    headers: responseHeaders,
  };
}
