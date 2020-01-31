import React, { useState } from "react";
import { Platform } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { registerRootComponent, AppLoading } from "expo";
import App from "./src/App";
import StatusBar from "./src/components/StatusBar";
import EventManager from "./src/events/EventsManager";
import loadAssets from "./src/utils/loadAssets";
import ErrorBoundary from "./src/components/ErrorBoundary";

const eventManager = new EventManager();

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  // TODO: check the conflicting StatusBar use (also used in AppContainer)
  return appIsReady ? (
    <ErrorBoundary>
      <PaperProvider>
        {Platform.OS === "ios" ? null : (
          <StatusBar backgroundColor="#000000" barStyle="light-content" />
        )}
        <App eventManager={eventManager} />
      </PaperProvider>
    </ErrorBoundary>
  ) : (
    <AppLoading
      startAsync={loadAssets}
      onFinish={() => setAppIsReady(true)}
      onError={console.error}
    />
  );
};

registerRootComponent(Main);
