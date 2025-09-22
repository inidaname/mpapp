interface LoginInput {
  email: string;
  password: string;
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
  blockchains: "SOL" | "SOL-DEVNET";
  accountType: "EOA" | "SCA";
}
