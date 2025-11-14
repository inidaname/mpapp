import { apiSlice } from "../apiSlice";

const convertEndpoint = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    convertFundsToWallet: build.mutation<APIData<ConvertData>, ConvertInput>({
      query: (body) => ({
        url: `/transactions/on-ramp`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["transactions"],
    }),
    convertFundsToBank: build.mutation<APIData<ConvertData>, WalletBankInput>({
      query: (body) => ({
        url: `/transactions/off-ramp`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["transactions"],
    }),
  }),
});

export const {
  useConvertFundsToBankMutation,
  useConvertFundsToWalletMutation,
} = convertEndpoint;
