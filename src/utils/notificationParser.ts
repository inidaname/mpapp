// utils/notificationParser.ts
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { BackendNotification, NotificationEvent } from "../types/notifications";

export const parseFirebaseNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): BackendNotification | null => {
  try {
    // Option 1: If backend sends data in notification body
    if (remoteMessage.notification?.body) {
      const parsed: NotificationEvent = JSON.parse(
        remoteMessage.notification.body,
      );
      return parsed.data;
    }

    // Option 2: If backend sends data in data payload
    if (remoteMessage.data) {
      const notification: BackendNotification = {
        user_id: remoteMessage.data.user_id as string,
        title: remoteMessage.data.title as string,
        message: remoteMessage.data.message as string,
        type: remoteMessage.data.type as any,
        data: remoteMessage.data.data
          ? JSON.parse(remoteMessage.data.data as string)
          : {},
      };
      return notification;
    }

    return null;
  } catch (error) {
    console.error("Error parsing notification:", error);
    return null;
  }
};
