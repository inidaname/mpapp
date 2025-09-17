/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BootSplash from "react-native-bootsplash";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/redux";
import "./global.css";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { HomeStackParams, RootStackParamList } from "./src/types/types";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import VerificationScreen from "./src/screens/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import CurrencyDetail from "./src/screens/CurrencyDetails";
import ConversionScreen from "./src/screens/ConversionScreen";
import AddFundsScreen from "./src/screens/AddFundsScreen";
import SendToBankScreen from "./src/screens/SendToBankScreen";
import AddBankScreen from "./src/screens/AddBankScreen";
import RecentActivitiesScreen from "./src/screens/RecentActivityScreen";
import StartScreen from "./src/screens/StartScreen";
import AddUserScreen from "./src/screens/AddUserScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeSendScreen from "./src/screens/HomeSendScreen";
import { Image, TouchableOpacity, View } from "react-native";
import AppText from "./src/components/typo/AppText";
import MenuPopover from "./src/components/utils/MenuPopOver";
import HomeReceiveScreen from "./src/screens/HomeReceiveScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createMaterialTopTabNavigator<HomeStackParams>();
interface Props extends NativeStackScreenProps<RootStackParamList> {}

// const { width } = Dimensions.get("window");

// TODO: improve this

// const CustomTabBar: React.FC<BottomTabBarProps> = ({ navigation }) => {
//   const DIP_WIDTH = 140;
//   const DIP_HEIGHT = 56;
//   const FAB_SIZE = 64;

//   return (
//     <View className="relative">
//       {/* Bottom bar row */}
//       <View className="flex-row h-20 w-full items-center justify-between px-10 bg-gray-100">
//         <TouchableOpacity
//           className="items-center w-1/3"
//           onPress={() => navigation.navigate("RecentActivities")}
//         >
//           <MaterialIcons name="timeline" size={22} color="gray" />
//           <Text className="text-gray-500 text-xs mt-1">Recent Activities</Text>
//         </TouchableOpacity>

//         {/* spacer keeps left/right buttons spaced evenly (center is taken by the concave shape) */}
//         <View style={{ width: DIP_WIDTH }} />

//         <TouchableOpacity
//           className="items-center w-1/3"
//           onPress={() => navigation.navigate("AddUser")}
//         >
//           <MaterialIcons name="person-add" size={22} color="gray" />
//           <Text className="text-gray-500 text-xs mt-1">Add User</Text>
//         </TouchableOpacity>
//       </View>

//       {/* White concave shape (absolute, centered) */}
//       <View
//         style={{
//           position: "absolute",
//           alignSelf: "center",
//           bottom: 20,
//           width: DIP_WIDTH,
//           height: DIP_HEIGHT,
//           borderBottomLeftRadius: DIP_WIDTH / 2,
//           borderBottomRightRadius: DIP_WIDTH / 2,
//           backgroundColor: "#ffffff",
//           zIndex: 1,
//           elevation: 1, // android stacking
//         }}
//       />

//       {/* Floating Action Button */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate("Add")}
//         style={{
//           position: "absolute",
//           alignSelf: "center",
//           // put the FAB so it sits inside the concave dip — tweak as needed:
//           bottom: DIP_HEIGHT - FAB_SIZE / 2 + 20,
//           width: FAB_SIZE,
//           height: FAB_SIZE,
//           borderRadius: FAB_SIZE / 2,
//           backgroundColor: "#2563EB",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 2,
//           elevation: 6,
//         }}
//       >
//         <MaterialIcons name="add" size={28} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export function AppTabs() {
//   return (
//     // eslint-disable-next-line react/no-unstable-nested-components
//     <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
//       <Tab.Screen
//         name="RecentActivities"
//         component={RecentActivitiesScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="Add"
//         component={HomeScreen}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="AddUser"
//         component={RecentActivitiesScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

const HomeStackTabs: React.FC<Props> = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-12">
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            className="w-12 h-12 rounded-full"
          />
          <AppText className="ml-3 text-brand-600 font-semibold">
            @codecrafter21
          </AppText>
        </View>
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity className="p-2 rounded-full">
            <Image source={require("./assets/blue_sphare.png")} />
          </TouchableOpacity>
          <MenuPopover />
        </View>
      </View>
      <HomeStack.Navigator className="flex-1 bg-gray-900">
        <HomeStack.Screen name="Send" component={HomeSendScreen} />
        <HomeStack.Screen name="Revceive" component={HomeReceiveScreen} />
      </HomeStack.Navigator>
    </View>
  );
};

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboarded === "true");
    };
    checkOnboarding();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={hasOnboarded ? "Login" : "Onboarding"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={HomeStackTabs}
            />
            <Stack.Screen name="CurrencyDetail" component={CurrencyDetail} />
            <Stack.Screen
              name="SendToBankScreen"
              component={SendToBankScreen}
            />
            <Stack.Screen
              name="AddBankScreen"
              component={AddBankScreen}
            />
            <Stack.Screen
              name="RecentActivitiesScreen"
              component={RecentActivitiesScreen}
            />
            <Stack.Screen
              name="AddUserScreen"
              component={AddUserScreen}
            />
            <Stack.Screen
              name="ConversionScreen"
              component={ConversionScreen}
            />
            <Stack.Screen
              name="AddFundsScreen"
              component={AddFundsScreen}
            />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="VerificationScreen"
              component={VerificationScreen}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
