export type RootStackParamList = {
  Home: undefined; // Home screen takes no parameters
  Profile: { userId: string }; // Profile screen expects a userId
  Settings: { theme: 'dark' | 'light' } | undefined; // Settings screen can optionally take a theme
};