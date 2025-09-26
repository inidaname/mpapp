import { setUserProfile } from "../../store/reducers/user-slice";
import {
  setActiveWallet,
  setActiveWalletAddrees,
  setWallets,
} from "../../store/reducers/wallet-slice";
import { apiSlice } from "../apiSlice";

const userEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query<APIData<UserProfile>, void>({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
      providesTags: [],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setUserProfile({ profile: data.data }));
        dispatch(setWallets(data.data.Wallet));
        dispatch(setWallets(data.data.Wallet));
        dispatch(
          setActiveWallet(data.data.Wallet.find((wallet) => wallet.is_active)!),
        );
        dispatch(
          setActiveWalletAddrees(
            data.data.Wallet.find((wallet) => wallet.is_active)
              ?.wallet_address ?? "",
          ),
        );
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } =
  userEndpoints;
