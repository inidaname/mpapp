import type React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import VerificationScreen from "../screens/VerificationScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import { AuthStackParamList } from "../types/types";

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
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
