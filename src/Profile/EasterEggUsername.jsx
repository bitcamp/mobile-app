import React, { Component } from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import colors from "../Colors";
import { Heading } from "../common/components/Base";

export default class EasterEggUsername extends Component {
  constructor(props) {
    super(props);

    this.state = {
      namePresses: 0,
      isInEasterEggMode: false,
      nameColor: colors.textColor.normal,
    };

    this.MAX_PRESS_NUMBER = 3;
    this.onNamePress = this.onNamePress.bind(this);
    this.getEasterEggName = this.getEasterEggName.bind(this);
  }

  onNamePress() {
    const { namePresses: oldNamePresses, isInEasterEggMode } = this.state;

    const namePresses = oldNamePresses + 1;
    this.setState({ namePresses });

    if (namePresses >= this.MAX_PRESS_NUMBER) {
      // Turn on easter egg mode if it's off right now
      if (!isInEasterEggMode) {
        Alert.alert("Congratulations!", "You have found the easter egg!", [
          { text: "OK" },
        ]);

        const colorCycler = setInterval(() => {
          // We have to grab these values from state each time
          // to prevent using the old state from upper scope
          const {
            isInEasterEggMode: easterEggStatus,
            nameColor: oldNameColor,
          } = this.state;

          // Toggle the name color each time the interval runs
          this.setState({
            nameColor:
              oldNameColor !== colors.primaryColor
                ? colors.primaryColor
                : colors.secondaryColor,
          });

          // Return to the regular color when you exit easter egg mode
          if (!easterEggStatus) {
            clearInterval(colorCycler);
            this.setState({
              nameColor: colors.textColor.normal,
            });
          }
        }, 250);
      } else {
        Alert.alert("Okay :(", "You can be a normal person again.", [
          { text: "OK" },
        ]);
      }

      // Invert the mode and reset the number of presses
      this.setState(({ isInEasterEggMode: oldEasterEggState }) => ({
        isInEasterEggMode: !oldEasterEggState,
        namePresses: 0,
      }));
    }
  }

  getEasterEggName() {
    const vowels = new Set(["a", "e", "i", "o", "u"]);
    const { username } = this.props;
    const name = username.toLowerCase();

    // Create a new string that replaces all vowels with 'oo'
    const newName = [...name].reduce(
      (nameWithReplacedVowels, char) =>
        vowels.has(char)
          ? `${nameWithReplacedVowels}oo`
          : nameWithReplacedVowels + char,
      ""
    );

    // Turn to title case
    return newName.replace(
      /\w\S*/g,
      word => word.charAt(0).toUpperCase() + word.substr(1)
    );
  }

  render() {
    const { isInEasterEggMode, nameColor } = this.state;
    const { style, username } = this.props;
    return (
      <TouchableOpacity onPress={this.onNamePress}>
        <Heading style={[style, { color: nameColor }]}>
          {isInEasterEggMode ? this.getEasterEggName() : username}
        </Heading>
      </TouchableOpacity>
    );
  }
}

EasterEggUsername.propTypes = {
  username: PropTypes.string.isRequired,
  style: Text.propTypes.style,
};

EasterEggUsername.defaultProps = {
  style: null,
};
