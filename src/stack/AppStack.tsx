import type React from "react";
import { useEffect } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import messaging from "@react-native-firebase/messaging";

// import { ActivityIndicator, View } from "react-native";

import { RootStackParamList } from "../types/types";

import HomeStackTabs from "./HomeStacks";
import AuthStack from "./AuthStach";

import { useAppDispatch, useAppSelector } from "../store/redux";
import {
  AddBankScreen,
  AddFundsScreen,
  AddUserScreen,
  ChangeCountry,
  ChangePasswordScreen,
  ChangePhoneScreen,
  ContactUsScreen,
  ConversionScreen,
  CurrencyDetail,
  DeviceProximityScreen,
  EditProfileScreen,
  FAQScreen,
  KycScreen,
  NearbyUsers,
  OfflinePaymentScreen,
  ProfileScreen,
  RecentActivitiesScreen,
  ScanWalletScreen,
  SendToBankScreen,
  SettingsScreen,
  WalletScreen,
} from "../screens";
import {
  notificationOpened,
  notificationReceived,
} from "../store/reducers/notification-slice";
import { parseFirebaseNotification } from "../utils/notificationParser";
import useNotificationBanner from "../hooks/useNotificationBanner";
import NotificationBanner from "../components/utils/NotificationBanner";
import { useGetWalletByIdQuery } from "../service/endpoints/wallets-endpoints";

export type RootNavigatorParams = {
  OnboardingStack: undefined;
  AuthStack: undefined;
  MainStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootStack = createNativeStackNavigator<RootNavigatorParams>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeStackTabs} />
      <Stack.Screen
        name="ScanWalletScreen"
        component={ScanWalletScreen}
      />
      <Stack.Screen name="CurrencyDetail" component={CurrencyDetail} />
      <Stack.Screen name="SendToBankScreen" component={SendToBankScreen} />
      <Stack.Screen name="AddBankScreen" component={AddBankScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="ChangePhoneScreen" component={ChangePhoneScreen} />
      <Stack.Screen name="ChangeCountry" component={ChangeCountry} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
      <Stack.Screen
        name="OfflinePaymentScreen"
        component={OfflinePaymentScreen}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="DeviceProximityScreen"
        component={DeviceProximityScreen}
      />
      <Stack.Screen
        name="NearbyUsers"
        component={NearbyUsers}
      />
      <Stack.Screen
        name="RecentActivitiesScreen"
        component={RecentActivitiesScreen}
      />
      <Stack.Screen name="AddUserScreen" component={AddUserScreen} />
      <Stack.Screen name="ConversionScreen" component={ConversionScreen} />
      <Stack.Screen name="AddFundsScreen" component={AddFundsScreen} />
      <Stack.Screen name="KYCScreen" component={KycScreen} />
    </Stack.Navigator>
  );
};

const AppStack: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { banner, showBanner, hideBanner } = useNotificationBanner();
  const dispatch = useAppDispatch();
  const { active_wallet } = useAppSelector((state) => state.wallet);
  const { refetch } = useGetWalletByIdQuery(active_wallet?.id ?? "");

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("remoteMessage", remoteMessage);
      const notification = parseFirebaseNotification(remoteMessage);
      if (notification) {
        showBanner(notification.title, notification.message);
        await refetch().unwrap();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBanner]);

  useEffect(() => {
    // Foreground notification listener
    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Notification received in foreground", remoteMessage);

        const notification = parseFirebaseNotification(remoteMessage);
        if (notification) {
          dispatch(notificationReceived(notification));
        }
      },
    );

    // Background notification opened
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Notification opened app from background", remoteMessage);

        const notification = parseFirebaseNotification(remoteMessage);
        if (notification) {
          dispatch(notificationOpened(notification));
        }
      },
    );

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification opened app from quit state", remoteMessage);

          const notification = parseFirebaseNotification(remoteMessage);
          if (notification) {
            dispatch(notificationOpened(notification));
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     // eslint-disable-next-line react-native/no-inline-styles
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  return (
    <>
      <NotificationBanner
        title={banner.title}
        body={banner.body}
        visible={banner.visible}
        onHide={hideBanner}
        onPress={() => {
          hideBanner();
          // You can navigate somewhere…
        }}
      />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {token
          ? <RootStack.Screen name="MainStack" component={MainStack} />
          : <RootStack.Screen name="AuthStack" component={AuthStack} />}
      </RootStack.Navigator>
    </>
  );
};

export default AppStack;
