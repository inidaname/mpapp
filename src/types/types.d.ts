export type RootStackParamList = {
  StartScreen: undefined;
  Home: import("@react-navigation/native-stack").NativeStackNavigatorProps<
    HomeStackParams
  >;
  AddUserScreen: undefined;
  ConversionScreen: undefined;
  AddFundsScreen: undefined;
  AddBankScreen: undefined;
  SendToBankScreen: undefined;
  ScanWalletScreen: undefined;
  ProfileScreen: undefined;
  WalletScreen: undefined;
  RecentActivitiesScreen: undefined;
  CurrencyDetail: { currency: string };
  SettingsScreen: undefined;
  OfflinePaymentScreen: undefined;
  DeviceProximityScreen: undefined;
  NearbyUsers: undefined;
  EditProfileScreen: undefined;
  ChangePasswordScreen: undefined;
  ChangePhoneScreen: undefined;
  ChangeCountry: undefined;
  FAQScreen: undefined;
  ContactUsScreen: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  VerificationScreen: { email: string };
  VerifyPhoneScreen: undefined;
  ForgotPassword: undefined;
  OfflinePaymentScreen: undefined; // Temporary
  DeviceProximityScreen: undefined; // Temporary
  NearbyUsers: undefined; // Temporary
};

export type FullNavStack =
  & AuthStackParamList
  & RootStackParamList
  & HomeStackParams;

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}

export type HomeStackParams = {
  Send: { wallet_address?: string } | undefined;
  Revceive: undefined;
};

export type CurrencyDetailNavigationProp =
  import("@react-navigation/native-stack").NativeStackNavigationProp<
    RootStackParamList,
    "CurrencyDetail"
  >;

type VerificationScreenNavigationProp =
  import("@react-navigation/native-stack").NativeStackNavigationProp<
    RootStackParamList,
    "VerificationScreen"
  >;
