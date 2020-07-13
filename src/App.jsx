import React, { useState } from "react";
import { AppLoading } from "expo";
import { StatusBar } from "react-native";
import { enableScreens } from "react-native-screens";
import { ReactQueryConfigProvider } from "react-query";
import RootStackScreen from "./navigation/RootStackScreen";
import loadAssets from "./common/utils/loadAssets";
import ErrorBoundary from "./common/components/ErrorBoundary";
import { EventsProvider } from "./contexts/EventsContext/EventsContext";
import colors from "./Colors";
import { FollowingProvider } from "./contexts/FollowingContext/FollowingContext";
import { AuthProvider } from "./contexts/AuthContext/AuthContext";

/**
 * All app-wide configuration should go here
 */

// React-native-screens optimization
enableScreens();

// React-Query common configs
const queryConfig = {};

/**
 * The main App component. Displays the main view of the app, wrapped
 * in all of the React Context providers. While assets are loading, it
 * displays a splash screen.
 */
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  return (
    <ErrorBoundary>
      {appIsReady ? (
        <>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.backgroundColor.light}
          />
          <AuthProvider>
            <ReactQueryConfigProvider config={queryConfig}>
              <EventsProvider>
                <FollowingProvider>
                  <RootStackScreen />
                </FollowingProvider>
              </EventsProvider>
            </ReactQueryConfigProvider>
          </AuthProvider>
        </>
      ) : (
        <>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
          />
          <AppLoading
            startAsync={loadAssets}
            onFinish={() => setAppIsReady(true)}
          />
        </>
      )}
    </ErrorBoundary>
  );
}
