import { apiSlice } from "../apiSlice";

const transactionEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendTransaction: build.mutation<APIData<SendSuccess>, SendTrans>({
      query: (body) => ({
        url: "/transactions/crypto",
        method: "POST",
        body,
      }),
      invalidatesTags: ["balance", "transactions"],
    }),
    getActiveNetworks: build.query<APIData<ActiveNetworks>, void>({
      query: () => ({
        url: "/transactions/active-networks",
        method: "GET",
      }),
    }),
    getTransaction: build.query<APIData<TransactionsList[]>, { page?: number }>(
      {
        query: ({ page }) => ({
          url: "/transactions",
          method: "GET",
          params: { page },
        }),
        providesTags: ["balance", "transactions"],
      },
    ),
  }),
});

export const {
  useSendTransactionMutation,
  useGetTransactionQuery,
  useLazyGetTransactionQuery,
  useGetActiveNetworksQuery,
  useLazyGetActiveNetworksQuery,
} = transactionEndpoints;
