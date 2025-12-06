import { useCallback, useEffect, useState } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { PermissionsAndroid, Platform } from "react-native";

export function useNotification(
  onNotificationEvent?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<
    "sandbox" | "production" | null
  >(null);

  // Request permissions
  const requestPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification Permission:", authStatus);
    }

    if (Platform.OS === "android" && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }, []);

  // Get device token and environment
  const getDeviceToken = useCallback(async () => {
    try {
      let token: string | null = await messaging().getToken();
      setEnvironment("production");
      // if (Platform.OS === "android") {
      //   token = await messaging().getToken();
      // } else if (Platform.OS === "ios") {
      //   token = await messaging().getAPNSToken();

      //   // Determine sandbox vs production based on build type
      //   const isDebug = __DEV__;
      //   setEnvironment(isDebug ? "sandbox" : "production");
      // }

      setDeviceToken(token ?? null);
      console.log("Device Token:", token, "Environment:", environment);
      return { token, environment };
    } catch (error) {
      console.error("Error getting device token:", error);
      return { token: null, environment: null };
    }
  }, [environment]);

  // Display local notifications
  const displayLocalNotification = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? "New Message",
        body: remoteMessage.notification?.body ?? "You have a new notification",
        android: {
          channelId: "default",
          smallIcon: "ic_launcher",
        },
      });
    },
    [],
  );

  // Create Android notification channel
  useEffect(() => {
    if (Platform.OS === "android") {
      notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });
    }
  }, []);

  // Token refresh listener
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((token) => {
      console.log("Token refreshed:", token);
      setDeviceToken(token);
    });
    return unsubscribe;
  }, []);

  // Notification listeners
  useEffect(() => {
    messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground message:", remoteMessage);
        await displayLocalNotification(remoteMessage);
        onNotificationEvent?.(remoteMessage);
      },
    );

    messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Opened from background:", remoteMessage?.notification);
        if (remoteMessage) onNotificationEvent?.(remoteMessage);
      },
    );

    messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) onNotificationEvent?.(remoteMessage);
    });
  }, [displayLocalNotification, onNotificationEvent]);

  return {
    requestPermission,
    getDeviceToken,
    deviceToken,
    environment,
  };
}
