import { apiSlice } from "../apiSlice";

const authEndpoint = apiSlice.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<object, LoginInput>({
      query: body => ({
        url: `/auth/login`,
        method: "POST",
        body
      })
    }),
    register: build.mutation<object, CreateUserInput>({
      query: body => ({
        url: `/auth/register`,
        method: "POST",
        body
      })
    })
  })
})

export const { useLoginMutation, useRegisterMutation } = authEndpoint