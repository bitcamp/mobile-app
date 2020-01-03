module.exports = {
  plugins: ["prettier"],

  extends: [
    // Airbnb's React style guide
    "airbnb",

    // React Native Community's style guide
    "@react-native-community",

    // Does 3 things:
    //  1. Turns prettier rules into eslint rules
    //  2. Disables eslint rules that conflict with prettier
    //  3. Classifies prettier rules as errors
    "plugin:prettier/recommended",

    // Turns off style-specific rules for different plugins
    "prettier/react",
  ],

  ignorePatterns: ["node_modules/"],
};
