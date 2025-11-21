import { apiSlice } from "../apiSlice";

const transactionEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    sendTransaction: build.mutation<APIData<SendSuccess>, SendTrans>({
      query: (body) => ({
        url: "/transactions/crypto",
        method: "POST",
        body,
      }),
      invalidatesTags: ["balance"],
    }),
    getTransaction: build.query<APIData<TransactionsList[]>, { page?: string }>(
      {
        query: ({ page }) => ({
          url: "/transactions",
          method: "GET",
          params: { page },
        }),
        providesTags: ["balance"],
      },
    ),
  }),
});

export const {
  useSendTransactionMutation,
  useGetTransactionQuery,
  useLazyGetTransactionQuery,
} = transactionEndpoints;
