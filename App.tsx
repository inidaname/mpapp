/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BootSplash from "react-native-bootsplash";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/redux";
import "./global.css";

import Onboarding from "./src/stack/Onboarding";
import AppStack from "./src/stack/AppStack";

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboarded === "true");
    };
    checkOnboarding();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {!hasOnboarded ? <Onboarding /> : <AppStack />}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
