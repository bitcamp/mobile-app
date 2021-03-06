module.exports = {
  root: true,

  plugins: ["prettier", "react-native"],

  // Enable new features (such as class properties)
  parser: "babel-eslint",

  extends: [
    // Airbnb's React style guide
    "airbnb",
    "airbnb/hooks",

    // Does 3 things:
    //  1. Turns prettier rules into eslint rules
    //  2. Disables eslint rules that conflict with prettier
    //  3. Classifies prettier rules as errors
    "plugin:prettier/recommended",

    // Turns off style-specific rules for different plugins
    "prettier/react",
  ],

  // All custom rule overrides go here. Each override should include an explanation
  // for why it is applied
  rules: {
    // Turn off this rule to allow StyleSheets to be placed at the bottom of files
    // It might be good to disable this in the future and strip out StyleSheets
    "no-use-before-define": "off",

    // Prevents unused styling rules
    "react-native/no-unused-styles": "error",

    // Prevents inline styles
    "react-native/no-inline-styles": "error",

    // Sorts styles in alphabetical order
    "react-native/sort-styles": "error",

    // Prevents style arrays with only one element
    "react-native/no-single-element-style-arrays": "error",

    // TODO: enable this rule in the future
    // Enables prop spreading
    "react/jsx-props-no-spreading": "off",

    // Allows you to reassign the properties of function parameters
    "no-param-reassign": ["error", { props: false }],

    // TODO: add this in when we're ready to start stripping
    // out styles that should be placed in a config file
    // "react-native/no-color-literals": "error",

    // Allows us to use static public properties (e.g. for `contextType`)
    // However, we still want propTypes and defaultProps to be declared outside the class.
    "react/static-property-placement": [
      "error",
      "static public field",
      {
        defaultProps: "property assignment",
        propTypes: "property assignment",
      },
    ],

    // Allow the use of dangling underscores to indicate private variables/functions
    "no-underscore-dangle": "off",
  },

  overrides: [
    {
      files: ["*.test.js", "*.test.jsx", "jest.setup.js"],
      rules: {
        // Often times, it is useful to use or spy on console statements in test files
        "no-console": "off",
      },
    },
  ],

  settings: {
    "import/resolver": {
      node: {
        // ".native.js" is in this list so the `react-native-screens` dependency is
        // recognized by ESLint (see https://github.com/software-mansion/react-native-screens/issues/62)
        extensions: [".js", ".jsx", ".json", ".native.js"],
      },
    },
  },

  env: {
    // Gives access to React Native globals (like `fetch()`)
    "react-native/react-native": true,
  },
};
