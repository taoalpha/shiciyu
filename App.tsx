import React, { useState, useEffect } from "react";
import { AppLoading } from 'expo';
import poemService from "./services/Poem";
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons';
import {AsyncStorage} from 'react-native';

import Home from "./modules/Home";

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}


async function _loadResourcesAsync() {
  return Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'shi': require('./assets/fonts/shi.ttf'),
    }),
  ]).then(() => undefined);
};

function _handleLoadingError(error) {
  // In this case, you might want to report the error to your error
  // reporting service, for example Sentry
  console.warn(error);
};

export default function App() {
  const [isLoadingComplete, setLoadCompleted] = useState(false);

  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={() => setLoadCompleted(true)}
      />
    );
  } else {
    return (
      <Home
        onNavigationStateChange={(prevState, currentState, action) => {
          const currentScreen = getActiveRouteName(currentState);
          const prevScreen = getActiveRouteName(prevState);

          if (prevScreen !== currentScreen) {
            AsyncStorage.setItem('lastActiveRoute', currentScreen);
          }
        }}
      />
    );
  };
}