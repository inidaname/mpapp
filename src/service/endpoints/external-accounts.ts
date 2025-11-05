import { apiSlice } from "../apiSlice";

const externalAccount = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    addAccount: build.mutation<APIData<AddedAccount>, ExternalAccountInput>(
      {
        query: (body) => ({
          url: `/external-accounts`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["external-accounts"],
      },
    ),
    getAccounts: build.query<APIData<ExternalAcctList>, void>({
      query: () => ({
        url: `/external-accounts`,
        method: "GET",
      }),
      providesTags: ["external-accounts"],
    }),
    getAccountsById: build.query<APIData<ExternalAccountDetail>, string>({
      query: (id) => ({
        url: `/external-accounts/${id}`,
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
  useGetAccountsByIdQuery,
  useLazyGetAccountsByIdQuery,
} = externalAccount;
