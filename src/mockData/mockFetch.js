/**
 * A stand-in for the standard fetch() function that returns a barebones
 * API response using dummy data.
 *
 * TODO: phase this function out once the app's backend is setup
 *
 * @param {*} url The fetch location (currently unused)
 * @param {*} resData The data you want the code to respond with
 * @param {*} options The options (currently unused)
 * @returns a promise that returns a Response object with a 200 status.
 * To access the response data, call the object's .json() method
 */
export default async function mockFetch(url, respData) {
  return {
    json: async () => respData,
    status: 200,
    statusText: "OK",
    ok: true,
  };
}
