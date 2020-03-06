import React from "react";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import PropTypes from "prop-types";
import FullScreenModal from "./FullScreenModal";

import AltModalHeader from "./AltModalHeader";
import SwipableTabBar from "../SwipableTabBar";
import colors from "../Colors";
import Images from "../../../assets/imgs";
import { getDeviceWidth } from "../../utils/sizing";

const floors = {
  "Floor 1": Images.floor1,
  "Floor 2": Images.floor2,
  "Floor 3": Images.floor3,
  Parking: Images.parking,
};

export default function MapModal(props) {
  const { isModalVisible, toggleModal } = props;
  const renderedFloors = Object.entries(floors).map(([floorTag, image]) => {
    return (
      <WebView
        key={floorTag}
        source={image}
        tabLabel={floorTag}
        minimumZoomScale={1}
        maximumZoomScale={8}
        style={styles.photo}
      />
    );
  });
  return (
    <FullScreenModal
      isVisible={isModalVisible}
      backdropColor={colors.backgroundColor.dark}
      onBackButtonPress={toggleModal}
      contentStyle={styles.modalContainer}
      header={
        <AltModalHeader
          title="Map"
          rightText="Done"
          leftText=""
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
  modalContainer: { padding: 0 },
  photo: {
    backgroundColor: colors.backgroundColor.dark,
    flex: 1,
    width: getDeviceWidth(),
  },
});

MapModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
