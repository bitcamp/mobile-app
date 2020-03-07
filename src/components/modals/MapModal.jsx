import React from "react";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import PropTypes from "prop-types";
import { Asset } from "expo-asset";
import FullScreenModal from "./FullScreenModal";

import AltModalHeader from "./AltModalHeader";
import SwipableTabBar from "../SwipableTabBar";
import colors from "../Colors";
import Images from "../../../assets/imgs/index";

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
 * Displays scalable event maps
 */
export default function MapModal(props) {
  const { isModalVisible, toggleModal } = props;
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
      isVisible={isModalVisible}
      backdropColor={colors.backgroundColor.dark}
      onBackButtonPress={toggleModal}
      contentStyle={styles.modalContainer}
      shouldntScroll
      header={
        <AltModalHeader
          title="Map"
          rightText="Done"
          rightAction={toggleModal}
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
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
