import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { PermissionsAndroid, Platform } from "react-native";

// 1. Request Permissions
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }

  if (Platform.OS === "android" && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
}

// 2. Get Device Token (Send this to your backend)
export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.log("Error getting token:", error);
  }
}

// 3. Display Notification (Foreground)
export async function displayLocalNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.DEFAULT,
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "New Message",
    body: remoteMessage.notification?.body as string ||
      "You have a new notification",
    android: {
      channelId,
      smallIcon: "ic_launcher",
    },
  });
}

// 4. Initialize Listeners
export function notificationListener() {
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log("A new FCM message arrived!", remoteMessage);
  });

  // Background/Quit Event (When user taps notification)
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification,
    );
    // Navigate user to specific screen here
  });

  // Quit State (When app is fully closed)
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification,
        );
        // Navigate user to specific screen here
      }
    });

  return unsubscribe;
}
