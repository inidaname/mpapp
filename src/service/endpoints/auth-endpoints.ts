import { apiSlice } from "../apiSlice";

const authEndpoint = apiSlice.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<APIData<SuccessLogin>, LoginInput>({
      query: body => ({
        url: `/auth/login`,
        method: "POST",
        body
      })
    }),
    register: build.mutation<APIData<UserData>, Omit<CreateUserInput, "confirmpassword">>({
      query: body => ({
        url: `/users`,
        method: "POST",
        body
      })
    }),
    sendOTP: build.mutation<APIData<UserData>, OTPInput>({
      query: body => ({
        url: `/auth/verify-otp`,
        method: "POST",
        body
      })
    })
  })
})

export const { useLoginMutation, useRegisterMutation, useSendOTPMutation } = authEndpoint