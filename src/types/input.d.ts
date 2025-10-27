interface LoginInput {
  email: string;
  password: string;
}

interface UserUpdate {
  email: string;
  username: string;
  phone_number: string;
  country: string;
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

interface CreateWalletInput {
  blockchains: string[];
  accountType: "EOA" | "SCA";
}

interface SendTrans {
  tokenId: string;
  destinationAddress: string;
  amount: string;
}
