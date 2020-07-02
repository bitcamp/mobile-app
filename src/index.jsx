import React, { useState } from "react";
import { registerRootComponent, AppLoading } from "expo";
import { StatusBar } from "react-native";
import { enableScreens } from "react-native-screens";
import { ReactQueryConfigProvider } from "react-query";
import App from "./App";
import loadAssets from "./utils/loadAssets";
import ErrorBoundary from "./components/ErrorBoundary";
import { EventsProvider } from "./contexts/EventsContext/EventsContext";
import colors from "./components/Colors";
import { FollowingProvider } from "./contexts/FollowingContext/FollowingContext";

// All app-wide configuration should go here

// React-native-screens optimization
enableScreens();

// React-Query configs
const queryConfig = {};

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  return appIsReady ? (
    <ErrorBoundary>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.backgroundColor.light}
      />
      <ReactQueryConfigProvider config={queryConfig}>
        <EventsProvider>
          <FollowingProvider>
            <App />
          </FollowingProvider>
        </EventsProvider>
      </ReactQueryConfigProvider>
    </ErrorBoundary>
  ) : (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setAppIsReady(true)}
      />
    </>
  );
};

registerRootComponent(Main);
