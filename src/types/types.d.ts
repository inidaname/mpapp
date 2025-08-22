export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  VerificationScreen: undefined;
  VerifyPhoneScreen: undefined;
  ForgotPassword: undefined;
  Profile: { userId: string }; // Profile screen expects a userId
  Settings: { theme: 'dark' | 'light' } | undefined; // Settings screen can optionally take a theme
};

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}
