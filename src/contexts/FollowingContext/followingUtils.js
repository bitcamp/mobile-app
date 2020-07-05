/**
 * Returns an object mapping event ids to the number of followers
 * @param {{eventId: number, count: number}[]} rawFollowCounts List of objects,
 * where
 */
export function computeFollowingCountObj(rawFollowCounts) {
  const followCountObj = {};

  rawFollowCounts.forEach(({ eventId, count }) => {
    followCountObj[eventId] = count;
  });

  return followCountObj;
}

/**
 * Returns a Set containing the ids of the events that the user follows
 * @param {number[]} rawFollowedEvents a list of ids for the events that a user follows
 */

export function computeUserFollowedEventsSet(rawFollowedEvents) {
  return new Set(rawFollowedEvents);
}
