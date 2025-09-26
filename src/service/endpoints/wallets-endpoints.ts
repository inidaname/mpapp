import { apiSlice } from "../apiSlice";

const walletsEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createWallet: build.mutation<APIData<WallectCreated>, CreateWalletInput>({
      query: (body) => ({
        url: `/wallets`,
        method: "POST",
        body,
      }),
    }),
    getWalletById: build.query<APIData<WallectDetail>, string>({
      query: (id) => ({
        url: `/wallets/${id}`,
        method: "GET",
      }),
      providesTags: ["balance"],
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletByIdQuery,
  useLazyGetWalletByIdQuery,
} = walletsEndpoints;
