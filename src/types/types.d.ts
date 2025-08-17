export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  Profile: { userId: string }; // Profile screen expects a userId
  Settings: { theme: 'dark' | 'light' } | undefined; // Settings screen can optionally take a theme
};
