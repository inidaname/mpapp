export type RootStackParamList = {
  Home: import('@react-navigation/native-stack').NativeStackNavigatorProps<HomeStackParams>;
  AddUserScreen: undefined;
  ConversionScreen: undefined;
  AddFundsScreen: undefined;
  AddBankScreen: undefined;
  SendToBankScreen: undefined;
  ScanWalletScreen: { from: 'AddUserScreen' | 'HomeSendScreen' };
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
  KYCScreen: { kycLink: string; tosLink: string };
};

export type AuthStackParamList = {
  StartScreen: undefined;
  Login: undefined;
  Signup: undefined;
  VerificationScreen: { email: string; login: boolean };
  VerifyPhoneScreen: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
};

export type FullNavStack = AuthStackParamList &
  RootStackParamList &
  HomeStackParams;

export interface Country {
  name: string;
  code: string;
  dial_code: string;
}

export type HomeStackParams = {
  Send:
    | {
        wallet_address?: string;
        blockchain?: Mainnet | Testnet;
      }
    | undefined;
  Receive: undefined;
};

export type CurrencyDetailNavigationProp =
  import('@react-navigation/native-stack').NativeStackNavigationProp<
    RootStackParamList,
    'CurrencyDetail'
  >;

export type AuthNavigationProp =
  import('@react-navigation/native-stack').NativeStackNavigationProp<AuthStackParamList>;

export type KYCScreenNavigationProp =
  import('@react-navigation/native-stack').NativeStackNavigationProp<
    RootStackParamList,
    'KYCScreen'
  >;

type VerificationScreenNavigationProp =
  import('@react-navigation/native-stack').NativeStackNavigationProp<
    RootStackParamList,
    'VerificationScreen'
  >;

type Mainnet =
  | 'Algorand'
  | 'Aptos'
  | 'Arbitrum'
  | 'Avalanche'
  | 'Base'
  | 'Celo'
  | 'Codex'
  | 'Ethereum'
  | 'Hedera'
  | 'HyperEVM'
  | 'Ink'
  | 'Linea'
  | 'NEAR'
  | 'Noble'
  | 'Optimism'
  | 'Polkadot_Asset_Hub'
  | 'Polkadot_Westmint'
  | 'Plume'
  | 'Polygon'
  | 'Sei'
  | 'Solana'
  | 'Sonic'
  | 'Stellar'
  | 'Sui'
  | 'Unichain'
  | 'World_Chain'
  | 'XDC'
  | 'ZKSync_Era';

// Testnet type
export type Testnet =
  | 'Algorand_Testnet'
  | 'Aptos_Testnet'
  | 'Arc_Testnet'
  | 'Arbitrum_Sepolia'
  | 'Avalanche_Fuji'
  | 'Base_Sepolia'
  | 'Celo_Alfajores_Testnet'
  | 'Codex_Testnet'
  | 'Ethereum_Sepolia'
  | 'Hedera_Testnet'
  | 'HyperEVM_Testnet'
  | 'Ink_Testnet'
  | 'Linea_Sepolia'
  | 'NEAR_Testnet'
  | 'Noble_Testnet'
  | 'Optimism_Sepolia'
  | 'Plume_Testnet'
  | 'Polygon_Amoy_Testnet'
  | 'Sei_Testnet'
  | 'Solana_Devnet'
  | 'Sonic_Testnet'
  | 'Stellar_Testnet'
  | 'Sui_Testnet'
  | 'Unichain_Sepolia'
  | 'World_Chain_Sepolia'
  | 'XDC_Apothem'
  | 'ZKSync_Sepolia';

interface Options {
  enabled?: boolean;
  onPaste?: (content: string) => void;
  validator?: (content: string) => boolean;
  checkOnMount?: boolean;
}

type UseAutoPaste = (options?: Options) => {
  clipboardContent: string;
  clearContent: () => void;
};
