import React from "react";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import PropTypes from "prop-types";
import { Asset } from "expo-asset";
import FullScreenModal from "../common/components/modals/FullScreenModal";
import AltModalHeader from "../common/components/modals/AltModalHeader";
import SwipableTabBar from "../common/components/SwipableTabBar";
import colors from "../Colors";
import Images from "../../assets/imgs/index";

/* On android, web views can't handle local images, but they can handle
 * HTML generated on-the-fly. So on ios, we just pass the image directly
 * to the web view, but on android, we have to make a basic HTML page.
 */
const getImageSource = moduleId =>
  Platform.OS === "android"
    ? {
        html: `
        <body style="
          background-color: ${colors.backgroundColor.dark};
          padding: 0; margin: 0;"
        >
          <img src="${Asset.fromModule(moduleId).uri}" width="100%"/>
        </body>`,
        baseUrl: Asset.fromModule(moduleId).uri,
      }
    : moduleId;

const floorSources = {
  "Floor 1": getImageSource(Images.floor1),
  "Floor 2": getImageSource(Images.floor2),
  "Floor 3": getImageSource(Images.floor3),
  Parking: getImageSource(Images.parking),
};

/**
 * Displays maps of the event venue that can scaled using zoom/pinch gestures.
 */
export default function MapModal(props) {
  const { navigation } = props;
  const renderedFloors = Object.entries(floorSources).map(
    ([floorName, imageSource]) =>
      imageSource && (
        <WebView
          key={floorName}
          source={imageSource}
          tabLabel={floorName}
          style={styles.photo}
          originWhitelist={["*"]}
        />
      )
  );

  return (
    <FullScreenModal
      contentStyle={styles.modalContainer}
      shouldntScroll
      header={
        <AltModalHeader
          title="Map"
          rightText="Done"
          rightAction={navigation.goBack}
        />
      }
    >
      <ScrollableTabView
        renderTabBar={({ goToPage, tabs, activeTab }) => (
          <SwipableTabBar {...{ goToPage, tabs, activeTab }} />
        )}
        style={styles.floorContainer}
      >
        {renderedFloors}
      </ScrollableTabView>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  floorContainer: {
    height: 530,
  },
  modalContainer: {
    padding: 0,
  },
  photo: {
    backgroundColor: colors.backgroundColor.dark,
    flex: 1,
  },
});

MapModal.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
