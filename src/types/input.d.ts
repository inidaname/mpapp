interface LoginInput {
  username: string;
  password: string;
}

interface CreateUserInput {
  email: string;
  phone_number: string;
  country: string;
  mailingAddress: string;
  encrypted_recovery_phrase: string;
  pin_hash: string;
}