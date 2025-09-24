interface APIData<T = {}> {
  data: T;
  message: string;
  statusCode: number;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  country: string;
  mailingAddress: string;
  encrypted_recovery_phrase: string;
  forgetPinToken: string;
  forgetPinTokenExpiration: Date | string;
  biometric_enabled: boolean;
  kyc_status: string;
  IsEmailVerified: boolean;
  IsPhoneNumberVerified: boolean;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

interface SuccessLogin {
  accessToken: string;
  id: string;
}

interface WallectCreated {
  address: string;
  id: string;
}

interface WalletData {
  id: string;
  user_id: string;
  wallet_address: string;
  circle_wallet_id: string;
  bridge_wallet_id: string;
  wallet_type: string;
  balance: string;
  blockchain: string[];
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  circle: {
    data: {
      tokenBalances: [];
    };
  };
}

interface UserProfile {
  id: "cmfpfa3x50003m910b68tprcm";
  email: "saniyhassan+3@gmail.com";
  username: "Saniyhassan";
  phone_number: null;
  circle_user_id: null;
  circle_wallet_id: null;
  wallet_address: null;
  country: null;
  mailingAddress: null;
  encrypted_recovery_phrase: null;
  forgetPinToken: null;
  forgetPinTokenExpiration: null;
  biometric_enabled: false;
  kyc_status: "PENDING_APPROVAL";
  IsEmailVerified: true;
  IsPhoneNumberVerified: false;
  created_at: "2025-09-18T13:04:25.434Z";
  updated_at: "2025-09-18T13:04:57.710Z";
  is_active: boolean;
  Wallet: WalletData[];
}
