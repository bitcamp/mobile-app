import { jest } from "@jest/globals";

// Ignore certain YellowBox warnings in tests
const warnings = ["AsyncStorage has been extracted from react-native core"];

const oldError = console.error;

jest.spyOn(console, "error").mockImplementation((...args) => {
  const string = args.join(" ");
  if (!warnings.some(warning => string.match(warning))) {
    oldError(...args);
  }
});
