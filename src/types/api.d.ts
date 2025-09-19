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