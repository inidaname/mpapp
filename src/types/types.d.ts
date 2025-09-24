export type RootStackParamList = {
  StartScreen: undefined;
  Home: undefined;
  AddUserScreen: undefined;
  ConversionScreen: undefined;
  AddFundsScreen: undefined;
  AddBankScreen: undefined;
  SendToBankScreen: undefined;
  ProfileScreen: undefined;
  WalletScreen: undefined;
  RecentActivitiesScreen: undefined;
  CurrencyDetail: { currency: string };
  SettingsScreen: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  VerificationScreen: { email: string };
  VerifyPhoneScreen: undefined;
  ForgotPassword: undefined;
};

export type FullNavStack = AuthStackParamList & RootStackParamList;

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}

export type HomeStackParams = {
  Send: undefined;
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
