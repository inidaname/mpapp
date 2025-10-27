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

interface CircleData {
  "data": {
    "tokenBalances": {
      "token": {
        "id": "ecf919b4-517f-5fde-b82b-393d1092e5fc";
        "blockchain": "SOL-DEVNET";
        "name": "Solana-Devnet";
        "symbol": "SOL-DEVNET";
        "decimals": 9;
        "isNative": true;
        "updateDate": "2024-02-28T13:55:28Z";
        "createDate": "2024-02-28T13:55:28Z";
      };
      "amount": "5";
      "updateDate": "2025-09-26T11:34:39Z";
    }[];
  };
}

interface SendSuccess {
  "id": "cmg0spcow0006m9jb1nifh1wh";
  "user_id": "cmfpfa3x50003m910b68tprcm";
  "wallet_id": "cmfv449vv0008m910i5u1ybfl";
  "currency_id": null;
  "offline_transaction_id": null;
  "transaction_hash": null;
  "sender_address": "BWZ5NYXoxfR84bwhTJ2NaYufynt2haTE7mFXqehFsubd";
  "recipient_address": "A3jzQ471nggNQ2CWanJHvG2Z2wgSNDmqpr26iJrw3DZ1";
  "amount": "2";
  "source": null;
  "destination": null;
  "features": null;
  "source_deposit_instructions": null;
  "balance_before": "10";
  "balance_after": null;
  "token_symbol": null;
  "token_id": "8fb3cadb-0ef4-573d-8fcd-e194f961c728";
  "circle_transaction_id": "b821739d-de13-5a55-bbe8-76e9c89d3219";
  "bridge_transaction_id": null;
  "transaction_type": null;
  "status": "PENDING";
  "blockchain": "SOL-DEVNET";
  "gas_fee": null;
  "exchange_rate": null;
  "local_currency": null;
  "local_amount": null;
  "created_offline": false;
  "synced_at": "2025-09-26T12:05:39.584Z";
  "created_at": "2025-09-26T12:05:39.584Z";
  "updated_at": "2025-09-26T12:05:39.584Z";
  "circleTransaction": {
    "id": "b821739d-de13-5a55-bbe8-76e9c89d3219";
    "state": "INITIATED";
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
