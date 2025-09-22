import type React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ActivityIndicator, View } from "react-native";

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
import { useAuthToken } from "../hooks/useAuthToken";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="Home" component={HomeStackTabs} />
      <Stack.Screen name="CurrencyDetail" component={CurrencyDetail} />
      <Stack.Screen name="SendToBankScreen" component={SendToBankScreen} />
      <Stack.Screen name="AddBankScreen" component={AddBankScreen} />
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
  const { token, loading } = useAuthToken();

  if (loading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return token ? <MainStack /> : <AuthStack />;
};

export default AppStack;
