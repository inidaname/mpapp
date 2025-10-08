import type React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { ActivityIndicator, View } from "react-native";

import { RootStackParamList } from "../types/types";

import HomeStackTabs from "./HomeStacks";
import AuthStack from "./AuthStach";

import { useAppSelector } from "../store/redux";
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
  NearbyUsers,
  OfflinePaymentScreen,
  ProfileScreen,
  RecentActivitiesScreen,
  ScanWalletScreen,
  SendToBankScreen,
  SettingsScreen,
  StartScreen,
  WalletScreen,
} from "../screens";
import Onboarding from "./Onboarding";

import { useAddDeviceNotyMutation } from "../service/endpoints/notification-endpoints";
import { useEffect, useState } from "react";

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();

  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

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
      <Stack.Screen name="StartScreen" component={StartScreen} />
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
    </Stack.Navigator>
  );
};

const AppStack: React.FC = () => {
  // const { token } = useAppSelector((state) => state.auth);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  const [addDevice] = useAddDeviceNotyMutation();

  useEffect(() => {
    (async () => {
      const hasPermission = await requestUserPermission();
      if (hasPermission) {
        const deviceToken = await messaging().getToken();

        const deviceReady = await addDevice({
          deviceToken,
          device: "Hassan",
        }).unwrap();
        console.log("deviceReady", deviceReady);
      } else {
        console.log("Permission denied", "Notifications won’t work.");
      }

      // Listen for token refresh
      return messaging().onTokenRefresh(async (newToken) => {
        console.log("FCM Token refreshed:", newToken);
        const deviceReady = await addDevice({
          deviceToken: newToken,
          device: "Hassan",
        }).unwrap();
        console.log("deviceReady", deviceReady);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Foreground message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("New Notification", remoteMessage.notification?.body ?? "");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboarded === "true");
    };
    checkOnboarding();
  }, []);

  // if (loading) {
  //   return (
  //     // eslint-disable-next-line react-native/no-inline-styles
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!hasOnboarded
        ? <RootStack.Screen name="OnboardingStack" component={Onboarding} />
        : token
        ? <RootStack.Screen name="MainStack" component={MainStack} />
        : <RootStack.Screen name="AuthStack" component={AuthStack} />}
    </RootStack.Navigator>
  );
};

export default AppStack;
