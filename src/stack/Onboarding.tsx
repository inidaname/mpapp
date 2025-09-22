import type React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";

type StackType = {
  Onboarding: undefined;
};

const OnboardingStack = createNativeStackNavigator<StackType>();

const Onboarding: React.FC = () => {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
    </OnboardingStack.Navigator>
  );
};

export default Onboarding;
