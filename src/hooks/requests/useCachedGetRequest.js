import { useState, useEffect, useCallback } from "react";
import { AsyncStorage } from "react-native";
import { useQuery } from "react-query";
import request from "../../utils/request";
import { returnSelf } from "../../utils/simpleFunctions";

const defaultGetConfig = {
  retry: 1, // TODO: tweak this values
  refetchInterval: 60 * 1000,
};

/**
 * A hook for fetching asynchronous data that uses AsyncStorage to cache responses.
 * For non-GET requests, use the regular `useFetch()` hook from 'use-http'.
 *
 * @param {string|any[]} queryKey The query key of the request (usually just the queryKey). See
 * https://github.com/tannerlinsley/react-query#query-keys.
 * @param {object} [options = {}] Options for this hook and the underlying `useQuery()` hook
 * @param {responseData => processedData} [options.postProcess = returnSelf] The function used
 * to process the raw data.
 * @param {any[]} [options.variables] Other variables to pass to the query function
 * that shouldn't be used in the `queryKey`.
 * @param {object} [options.queryConfig = {}] Config data that will be fed directly into the
 * `useQuery()` hook. See https://github.com/tannerlinsley/react-query#options for more info.
 * @returns an object with the following structure: `{ status, data, error, isFetching,
 * failureCount, refetch }`. See https://github.com/tannerlinsley/react-query#returns-2 for more
 * info about the return value.
 */
export default function useCachedGetRequest(
  queryKey,
  { variables, postProcess = returnSelf, queryConfig = {} } = {}
) {
  const cacheKey = JSON.stringify(queryKey);

  // Cached data (will be immediately overwritten by any valid data)
  const [cacheWasAccessed, setCacheWasAccessed] = useState(false);
  const [restoredData, setRestoredData] = useState(null);

  // Performs a standard GET reqeust and caches the result using AsyncStorage. Any errors
  // that arise in the query function will automatically get thrown
  const cachedGetRequest = useCallback(
    async (...args) => {
      const data = await request(...args);

      AsyncStorage.setItem(cacheKey, JSON.stringify(data)).catch(e =>
        console.warn(`Error caching response for ${cacheKey}: ${e.message}`)
      );

      try {
        return postProcess(data);
      } catch (e) {
        throw new Error(`Error processing data from ${cacheKey}: ${e.message}`);
      }
    },
    [cacheKey, postProcess]
  );

  // Raw query hook
  const queryResults = useQuery({
    queryKey,
    queryFn: cachedGetRequest,
    variables,
    config: {
      ...defaultGetConfig,
      ...queryConfig,
    },
  });

  // Retrieves the cached response data for a particular URL
  useEffect(() => {
    let didUnmount = false;

    // Only try to restore the cache once when the component using this hook mounts
    if (!cacheWasAccessed) {
      setCacheWasAccessed(true);

      const restoreDataFromCache = async () => {
        // Get cached response from AsyncStorage
        let dataFromCache = null;
        try {
          const rawData = JSON.parse(await AsyncStorage.getItem(cacheKey));
          dataFromCache = rawData && postProcess(rawData);
        } catch (e) {
          console.log(
            `Error restoring cached response for ${cacheKey}, fetching data from backend...`
          );
        }

        if (!didUnmount) {
          // Only restores the data if the hook is still in use
          setRestoredData(dataFromCache);
        }
      };

      restoreDataFromCache();
    }

    return () => {
      didUnmount = true;
    };
  }, [cacheKey, cacheWasAccessed, postProcess, restoredData]);

  return {
    ...queryResults,
    data: queryResults.data || restoredData,
  };
}
