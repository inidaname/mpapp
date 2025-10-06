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

import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

async function getAndRegisterToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);

    await fetch("https://your-backend.com/api/register-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error("Error getting FCM token", err);
  }
}

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        await getAndRegisterToken();
      } else {
        Alert.alert("Permission denied", "Notifications won’t work.");
      }

      // Listen for token refresh
      return messaging().onTokenRefresh(async (newToken) => {
        console.log("FCM Token refreshed:", newToken);
        await fetch("https://your-backend.com/api/register-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: newToken }),
        });
      });
    })();
  }, []);

  // Foreground message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("New Notification", remoteMessage.notification?.body ?? "");
    });
    return unsubscribe;
  }, []);

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
