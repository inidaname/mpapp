import { apiSlice } from "../apiSlice";

const externalAccount = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    addAccount: build.mutation({
      query: (body) => ({
        url: `/external-accounts`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["external-accounts"],
    }),
    getAccounts: build.query<APIData<object[]>, void>({
      query: () => ({
        url: `/external-accounts`,
        method: "GET",
      }),
      providesTags: ["external-accounts"],
    }),
  }),
});

export const {
  useAddAccountMutation,
  useGetAccountsQuery,
  useLazyGetAccountsQuery,
} = externalAccount;
