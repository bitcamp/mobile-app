/* eslint-disable import/prefer-default-export */

import { useContext } from "react";

const isVowelRegex = /[aeiou]/i;

/**
 * Like the default useContext() hook, except it will throw a descriptive error
 * if the context is undefined.
 * @param {React.Context} context The react context to use
 * @param {string} providerName The name of the provider used by the context (e.g., "EventsProvider")
 * @param {string} hookName The name of the custom hook using this function
 * @returns The context, as long as it is defined
 */
export function useContextSafely(context, providerName, hookName) {
  const ctx = useContext(context);

  if (ctx === undefined) {
    const aOrAn = isVowelRegex.test(providerName[0]) ? "an" : "a";

    throw new Error(`${hookName} must be used within ${aOrAn} ${providerName}`);
  }

  return ctx;
}
