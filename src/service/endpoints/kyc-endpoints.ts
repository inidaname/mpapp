import { apiSlice } from "../apiSlice";

const kycEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    startKYC: build.mutation<APIData<KYCDetail>, void>({
      query: () => ({
        url: `/kyc`,
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),
    getKYC: build.query<APIData<object>, void>({
      query: () => ({
        url: `/kyc`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const { useGetKYCQuery, useLazyGetKYCQuery, useStartKYCMutation } =
  kycEndpoints;
