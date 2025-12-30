interface LoginInput {
  email: string;
  password: string;
}

interface UserUpdate {
  email: string;
  username: string;
  phone_number: string;
  country: string;
  file: {
    uri: string;
    fileType: string;
    fileName: string;
  };
}

interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
}

interface OTPInput {
  email: string;
  otp: string;
}

interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

interface ResetPassword {
  email: string;
  pin: string;
  forgetPinToken: string;
}

interface PhoneOTPInput {
  phoneNumber: string;
  otp: string;
}

interface CreateWalletInput {
  blockchains: string[];
  accountType: 'EOA' | 'SCA';
}

interface SendTrans {
  tokenId: string;
  destinationAddress: string;
  amount: string;
  destinationChain: import('./types').Mainnet | import('./types').Testnet;
}

interface PasswordForm {
  email: string;
  forgetPinToken?: string;
  otp: string;
  password: string;
}

interface ContactInput {
  // first_name: string;
  // last_name: string;
  // chain: string;
  // address: string;
  username: string;
}

interface ConvertInput {
  amount: string;
  source: {
    currency: string;
    payment_rail: string;
  };
  destination: {
    currency: string;
    payment_rail: string;
    to_address: string;
  };
}

interface WalletBankInput {
  currency: string;
  chain: string;
  external_account_id: string;
  address: string;
  tokenId: string;
  amount: string;
}
