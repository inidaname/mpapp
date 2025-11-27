import { setUSDCWallet } from "../../store/reducers/usdc-slice";
import { apiSlice } from "../apiSlice";

const walletsEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createWallet: build.mutation<APIData<WallectCreated>, CreateWalletInput>({
      query: (body) => ({
        url: `/wallets`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["wallet", "balance"],
    }),
    getWalletById: build.query<APIData<WallectDetail>, string>({
      query: (id) => ({
        url: `/wallets/${id}`,
        method: "GET",
      }),
      providesTags: ["balance", "wallet"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setUSDCWallet(data.data.circle.data.tokenBalances));
      },
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useGetWalletByIdQuery,
  useLazyGetWalletByIdQuery,
} = walletsEndpoints;
