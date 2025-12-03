import { useCallback, useEffect } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { PermissionsAndroid, Platform } from "react-native";

export function useNotification(
  onNotificationEvent?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  const requestPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();

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

  const getDeviceToken = useCallback(async () => {
    try {
      const token = Platform.OS === "android"
        ? await messaging().getToken()
        : await messaging().getAPNSToken();
      console.log("FCM Token:", token);
      return token;
    } catch (error) {
      console.log("Error getting token:", error);
    }
  }, []);

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

  // Create notification channel once
  useEffect(() => {
    const createChannel = async () => {
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.LOW,
      });
    };

    createChannel();
  }, []);

  // Token refresh listener
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh((token) => {
      console.log("New FCM token:", token);
    });

    return unsubscribe;
  }, []);

  // Notification listeners
  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground message:", remoteMessage);

        await displayLocalNotification(remoteMessage);

        if (onNotificationEvent) {
          onNotificationEvent(remoteMessage);
        }
      },
    );

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Opened from background:", remoteMessage?.notification);

        if (onNotificationEvent && remoteMessage) {
          onNotificationEvent(remoteMessage);
        }
      },
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Opened from quit state:", remoteMessage.notification);

          if (onNotificationEvent) {
            onNotificationEvent(remoteMessage);
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, [displayLocalNotification, onNotificationEvent]);

  return {
    requestPermission,
    getDeviceToken,
  };
}
