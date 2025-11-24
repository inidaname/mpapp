import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BootSplash from "react-native-bootsplash";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/redux";
import "./global.css";

import AppStack from "./src/stack/AppStack";
import { handleAppLaunch } from "./src/helpers/handle-app-launch";
import {
  getFCMToken,
  notificationListener,
  requestUserPermission,
} from "./src/helpers/notification-helps";

function App() {
  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    const unsubscribe = notificationListener();
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      await handleAppLaunch();
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash hidden");
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
