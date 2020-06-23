import React from "react";
import PropTypes from "prop-types";
import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PadContainer } from "./Base";
import { H2, H3 } from "./Text";
import { getDeviceWidth, getImageHeight } from "../utils/sizing";
import colors from "./Colors";
import { imageType } from "../utils/PropTypeUtils";

/** A banner that fills the width of the screen. It has a background image, 
    a title, and a description */
const Banner = ({ imageSource, description, title }) => (
  <ImageBackground style={styles.imageBg} source={imageSource}>
    <LinearGradient
      style={styles.darkImageMask}
      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.65)"]}
      locations={[0.3, 1]}
    >
      <PadContainer style={styles.textGroup}>
        <H3 style={styles.description} numberOfLines={1}>
          {description}
        </H3>
        <H2 style={styles.title} numberOfLines={2}>
          {title}
        </H2>
      </PadContainer>
    </LinearGradient>
  </ImageBackground>
);

Banner.propTypes = {
  title: PropTypes.string.isRequired,
  imageSource: imageType.isRequired,
  description: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  darkImageMask: {
    flex: 1,
  },
  description: {
    color: colors.textColor.primary,
    fontWeight: "bold",
  },
  imageBg: {
    height: getImageHeight(),
    position: "relative",
    width: getDeviceWidth(),
  },
  textGroup: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  title: {
    color: colors.textColor.primary,
    fontSize: 26,
  },
});

export default Banner;
