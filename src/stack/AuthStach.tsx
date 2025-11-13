import type React from "react";
import { useEffect, useState } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { AuthStackParamList } from "../types/types";
import OnboardingScreen from "../screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartScreen from "../screens/StartScreen";

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const onboarded = await AsyncStorage.getItem("hasOnboarded");
      setHasOnboarded(onboarded === "true");
    };
    checkOnboarding();
  }, []);

  return (
    <AuthStackNav.Navigator
      initialRouteName={!hasOnboarded ? "Onboarding" : "StartScreen"}
      screenOptions={{ headerShown: false }}
    >
      <AuthStackNav.Screen name="StartScreen" component={StartScreen} />

      <AuthStackNav.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Signup" component={SignupScreen} />
      <AuthStackNav.Screen
        name="VerificationScreen"
        component={VerificationScreen}
      />
      <AuthStackNav.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </AuthStackNav.Navigator>
  );
};

export default AuthStack;
