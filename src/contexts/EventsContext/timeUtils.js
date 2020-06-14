import moment from "moment";

/**
 * @param {string|moment} time A valid time string or moment
 * @throws Error if the time is null or invalid
 * @returns an ISO-compliant string representing the day (e.g., "2020-03-14")
 */
export function getDay(time) {
  checkValidTime(time);
  return moment(time).format("YYYY-MM-DD");
}

/**
 * @param {string|moment} time A valid time string or moment
 * @returns which weekday the time starts (e.g., "Friday")
 */
export function getWeekDay(time) {
  checkValidTime(time);
  return moment(time).format("dddd");
}

/**
 * @param {string|moment} time A valid time string or moment
 * @returns the time's hour (e.g., "5:00 PM")
 */
export function getTimeOfDay(time) {
  checkValidTime(time);
  return moment(time).format("h:mm A");
}

/**
 * @param {string} time a string that is has the format ISO 8601
 * @returns whether the string is a valid ISO 8601 date
 */
export function isValidTime(time) {
  return moment(time, moment.ISO_8601, true).isValid();
}

/**
 * Ensures that the given time is valid
 * @param {string} time a string that is has the format ISO 8601
 */
function checkValidTime(time) {
  if (!isValidTime(time)) {
    throw new Error(`${time} isn't a valid time`);
  }
}
