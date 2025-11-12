interface APIData<T = {}> {
  data: T;
  message: string;
  statusCode: number;
}

interface ExternalAccountInput {
  account_type: string;
  currency: string;
  account_owner_type: string;
  first_name: string;
  last_name: string;
  address: {
    street_line_1: string;
    city: string;
    country: string;
    state: string;
    postal_code: string;
  };
  account: {
    checking_or_savings: string;
    routing_number: string;
    account_number: string;
  };
  account_owner_name: string;
}
interface ExternalAcctList {
  count: number;
  data: ExternalAccountDetail[];
}

interface AddedAccount {
  id: string;
  external_account_id: string;
  currency: string;
  bank_name: string;
  account_owner_name: string;
  account_number: null | string;
  routing_number: null | string;
  account_owner_type: null | string;
  account_type: null | string;
  first_name: null | string;
  last_name: null | string;
  business_name: string | null;
  iban: string;
  account: {
    last_4: string;
    routing_number: string;
    checking_or_savings: string;
  };
  swift: null;
  clabe: null;
  address: null;
  customer_id: string;
}

interface ExternalAccountDetail {
  id: string;
  customer_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  bank_name: string;
  account_name: string | null;
  account_owner_name: string;
  active: boolean;
  currency: string;
  account_owner_type: string;
  account_type: string;
  first_name: string;
  last_name: string;
  business_name: string | null;
  account: {
    last_4: string;
    routing_number: string;
    checking_or_savings: string;
  };
  beneficiary_address_valid: boolean;
  last_4: string;
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
  bridgeCustomer: {
    id: string;
    type: string;
    email: string;
    status: string;
    last_name: string;
    created_at: string | Date;
    first_name: string;
    updated_at: string | Date;
    capabilities: {
      payin_fiat: string;
      payout_fiat: string;
      payin_crypto: string;
      payout_crypto: string;
    };
    endorsements: Endorsements[];
    requirements_due: string[];
    rejection_reasons: string[];
    residential_address: {
      country: string;
      subdivision: string;
    };
    persona_inquiry_type: string;
    future_requirements_due: string[];
    has_accepted_terms_of_service: boolean;
  };
}

interface Endorsements {
  name: string;
  status: string;
  requirements: {
    issues: string[];
    missing: string | null;
    pending: string[];
    complete: string[];
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

interface ContactData {
  contacts: Contact[];
  totalCount: number;
}

interface Contact extends ContactInput {
  id: string;
}
