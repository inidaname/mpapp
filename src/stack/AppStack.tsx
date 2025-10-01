import type React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { ActivityIndicator, View } from "react-native";

import { RootStackParamList } from "../types/types";

import AddBankScreen from "../screens/AddBankScreen";
import AddFundsScreen from "../screens/AddFundsScreen";
import AddUserScreen from "../screens/AddUserScreen";
import ConversionScreen from "../screens/ConversionScreen";
import CurrencyDetail from "../screens/CurrencyDetails";
import RecentActivitiesScreen from "../screens/RecentActivityScreen";
import SendToBankScreen from "../screens/SendToBankScreen";
import StartScreen from "../screens/StartScreen";
import HomeStackTabs from "./HomeStacks";
import AuthStack from "./AuthStach";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WalletScreen from "../screens/WalletScreen";

import { useAppSelector } from "../store/redux";
import ScanWalletScreen from "../screens/ScanWalletScreen";
import OfflinePaymentScreen from "../screens/OfflinePaymentScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import DeviceProximityScreen from "../screens/DeviceProximityScreen";
import NearbyUsers from "../screens/NearbyUsers";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
  const { token } = useAppSelector((state) => state.auth);

  // if (loading) {
  //   return (
  //     // eslint-disable-next-line react-native/no-inline-styles
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  return token ? <MainStack /> : <AuthStack />;
};

export default AppStack;
