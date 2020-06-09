import React, { useState } from "react";
import { registerRootComponent, AppLoading } from "expo";
import { StatusBar } from "react-native";
import App from "./src/App";
import loadAssets from "./src/utils/loadAssets";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { EventsProvider } from "./src/events/EventsContext";
import colors from "./src/components/Colors";

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  return appIsReady ? (
    <ErrorBoundary>
      <EventsProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.backgroundColor.light}
        />
        <App />
      </EventsProvider>
    </ErrorBoundary>
  ) : (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setAppIsReady(true)}
      />
    </>
  );
};

registerRootComponent(Main);
