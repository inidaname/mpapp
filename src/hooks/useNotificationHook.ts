import { useCallback, useEffect, useState } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';

export function useNotification(
  onNotificationEvent?: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<
    'sandbox' | 'production' | null
  >(null);

  const requestPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
    return enabled;
  }, []);

  const getDeviceToken = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      setEnvironment('production');
      setDeviceToken(token ?? null);
      return { token, environment: 'production' };
    } catch (error) {
      console.error('Error getting device token:', error);
      return { token: null, environment: null };
    }
  }, []);

  const displayLocalNotification = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? 'New Message',
        body: remoteMessage.notification?.body ?? 'You have a new notification',
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    },
    [],
  );

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received');
      await displayLocalNotification(remoteMessage);
      onNotificationEvent?.(remoteMessage);
    });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('App opened from background state');
        if (remoteMessage) onNotificationEvent?.(remoteMessage);
      });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state');
          onNotificationEvent?.(remoteMessage);
        }
      });

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
      setDeviceToken(token);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
      unsubscribeTokenRefresh();
    };
  }, [displayLocalNotification, onNotificationEvent]);

  return {
    requestPermission,
    getDeviceToken,
    deviceToken,
    environment,
  };
}
