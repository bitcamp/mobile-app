import PropTypes from "prop-types";

// Makes the given prop required if the given condition is satisfied.
// Due to intricacies with the prop-types library, you have to supply
// a custom validator to check if the prop is valid.
// Code taken from https://github.com/jamiebuilds/react-required-if
export function requiredIf(condition, propValidator) {
  return (props, propName, componentName) => {
    if (typeof condition !== "function") {
      return new Error(
        `Invalid requiredIf condition supplied to ${componentName}. Validation failed.`
      );
    }

    if (typeof propValidator !== "function") {
      return new Error(
        `Invalid requiredIf propValidator supplied to ${componentName}. Validation failed.`
      );
    }

    if (condition(props, propName, componentName)) {
      if (!props[propName]) {
        return new Error(
          `${propName} is a required prop, but its value was ${props[propName]}`
        );
      }

      if (!propValidator(props, propName, componentName)) {
        return new Error(
          `${propName} did not pass your validation in ${componentName}. The value provided was ${props[propName]}`
        );
      }
    }

    // Otherwise, it passed the prop type check
    return null;
  };
}

// Validation for an image source
export const imageType = PropTypes.oneOfType([
  PropTypes.number, // When using require('PATH_TO_IMG'), it returns a number
  PropTypes.shape({
    uri: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    scale: PropTypes.number,
  }),
]);

// A function that does nothing (should be used for any empty functions
// (e.g. the defaultProp for a function)
export const noop = () => {};
