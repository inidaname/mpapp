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
  id: string;
  email: string;
  username: string;
  phone_number: string;
  circle_user_id: string;
  circle_wallet_id: string;
  wallet_address: string;
  country: string;
  mailingAddress: string;
  profile_image: string;
  encrypted_recovery_phrase: string;
  forgetPinToken: string;
  forgetPinTokenExpiration: string;
  biometric_enabled: boolean;
  kyc_status: "PENDING_APPROVAL" | "APPROVED";
  IsEmailVerified: boolean;
  IsPhoneNumberVerified: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  is_active: boolean;
  profile_image: string;
  Wallet: WalletData[];
  SNS: [];
}

interface WallectDetail extends WalletData {
  circle: CircleData;
}

interface KYCDetail {
  id: string;
  user_id: string;
  customer_id: string;
  kyc_id: string;
  metadata: KYCMetaData;
  customerData: null | object | string;
  status: string;
}

interface KYCMetaData {
  kyc: {
    id: string;
    type: string;
    email: string;
    kyc_link: string;
    tos_link: string;
    full_name: string;
    created_at: string | Date;
    kyc_status: string;
    tos_status: string;
    customer_id: string;
    rejection_reasons: string[];
    persona_inquiry_type: string;
  };
}

interface Token {
  id: string;
  blockchain: string;
  name: string;
  symbol: string;
  decimals: number;
  isNative: boolean;
  updateDate: string | Date;
  createDate: string | Date;
}

interface CircleData {
  data: {
    tokenBalances: {
      token: Token;
      amount: string;
      updateDate: string | Date;
    }[];
  };
}

interface SendSuccess {
  id: string;
  user_id: string;
  wallet_id: string;
  currency_id: string;
  offline_transaction_id: string;
  transaction_hash: string;
  sender_address: string;
  recipient_address: string;
  amount: string;
  source: null;
  destination: null;
  features: null;
  source_deposit_instructions: null;
  balance_before: string;
  balance_after: string;
  token_symbol: string;
  token_id: string;
  circle_transaction_id: string;
  bridge_transaction_id: string;
  transaction_type: string;
  status: string;
  blockchain: string;
  gas_fee: string;
  exchange_rate: string;
  local_currency: string;
  local_amount: string;
  created_offline: boolean;
  synced_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  circleTransaction: {
    id: string;
    state: string;
  };
}

interface TransactionsList {
  id: string;
  user_id: string;
  wallet_id: string;
  currency_id: string;
  offline_transaction_id: string;
  transaction_hash: string;
  sender_address: string;
  recipient_address: string;
  amount: string;
  source: string;
  destination: string;
  features: string;
  source_deposit_instructions: string;
  balance_before: string;
  balance_after: string;
  token_symbol: string;
  token_id: string;
  circle_transaction_id: string;
  bridge_transaction_id: string;
  transaction_type: string;
  status: string;
  blockchain: string;
  gas_fee: string;
  exchange_rate: string;
  local_currency: string;
  local_amount: string;
  created_offline: string;
  synced_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}
