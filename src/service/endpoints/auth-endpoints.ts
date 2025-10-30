import { apiSlice } from "../apiSlice";

const authEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<APIData<SuccessLogin>, LoginInput>({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
    }),
    register: build.mutation<
      APIData<UserData>,
      Omit<CreateUserInput, "confirmpassword">
    >({
      query: (body) => ({
        url: `/users`,
        method: "POST",
        body,
      }),
    }),
    changePassword: build.mutation<APIData<object>, ChangePassword>({
      query: (body) => ({
        url: `/auth/change-password`,
        method: "POST",
        body,
      }),
    }),
    forgetPassword: build.mutation<APIData<object>, string>({
      query: (email) => ({
        url: `/auth/forget-password`,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: build.mutation<APIData<object>, PasswordForm>({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
    }),
    requestPhone: build.mutation<APIData<object>, string>({
      query: (phoneNumber) => ({
        url: `/auth/request-change-phone`,
        method: "POST",
        body: { phoneNumber },
      }),
    }),
    changePhone: build.mutation<APIData<object>, PhoneOTPInput>({
      query: (body) => ({
        url: `/auth/change-phone`,
        method: "POST",
        body,
      }),
    }),
    verifyOTP: build.mutation<APIData<SuccessLogin>, OTPInput>({
      query: (body) => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body,
      }),
    }),
    resendOTP: build.mutation<APIData<UserData>, Pick<OTPInput, "email">>({
      query: (body) => ({
        url: `/auth/resend-otp`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useChangePhoneMutation,
  useRequestPhoneMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authEndpoint;
