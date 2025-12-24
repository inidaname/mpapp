/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background:", remoteMessage);

  const body = remoteMessage?.notification?.body;
  try {
    console.log("Parsed:", JSON.parse(body ?? "{}"));
  } catch {
    console.log("Raw body:", body);
  }
});


AppRegistry.registerComponent(appName, () => App);
