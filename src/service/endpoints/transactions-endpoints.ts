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
  }),
});

export const { useSendTransactionMutation } = transactionEndpoints;
