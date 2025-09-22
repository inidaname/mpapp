import { apiSlice } from "../apiSlice";

const walletsEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createWallet: build.mutation<object, CreateWalletInput>({
      query: (body) => ({
        url: `/wallets`,
        method: "POST",
        body,
      }),
    }),
    getWalletById: build.query({
      query: (id) => ({
        url: `/wallets/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletByIdQuery,
  useLazyGetWalletByIdQuery,
} = walletsEndpoints;
