import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import BootSplash from "react-native-bootsplash";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/redux";
import "./global.css";

import messaging from "@react-native-firebase/messaging";

import AppStack from "./src/stack/AppStack";
import { handleAppLaunch } from "./src/helpers/handle-app-launch";
import { requestPermissions } from "./src/utils/ble-service";

function App() {
  useEffect(() => {
    const init = async () => {
      await handleAppLaunch();
      await requestPermissions();
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash hidden");
    });
  }, []);

  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived!", remoteMessage);
    });

    // return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppStack />
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
