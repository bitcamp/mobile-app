import PropTypes from "prop-types";

// A utility for making a function required if the dependentProp is passed into this component
export function requireFunctionIfPresent(dependentProp) {
  return (props, propName) => {
    // Disable this rule, since it would be much uglier to
    // deconstruct with this variably-named prop
    // eslint-disable-next-line react/destructuring-assignment
    if (props[dependentProp]) {
      if (!props[propName]) {
        return new Error(
          `You must provide '${propName}' if '${dependentProp}' is present`
        );
      }
      if (typeof props[propName] !== "function") {
        return new Error(`The '${propName}' property isn't a function`);
      }
    }

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
