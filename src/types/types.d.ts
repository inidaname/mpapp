export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  VerificationScreen: undefined;
  VerifyPhoneScreen: undefined;
  ConversionScreen: undefined;
  ForgotPassword: undefined;
  CurrencyDetail: { currency: string };
  Profile: { userId: string }; // Profile screen expects a userId
  Settings: { theme: 'dark' | 'light' } | undefined; // Settings screen can optionally take a theme
};

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}

export type CurrencyDetailNavigationProp = import("@react-navigation/native-stack").NativeStackNavigationProp<
  RootStackParamList,
  "CurrencyDetail"
>;