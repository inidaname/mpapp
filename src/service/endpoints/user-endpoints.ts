import { setUserProfile } from "../../store/reducers/user-slice";
import {
  setActiveWallet,
  setActiveWalletAddrees,
  setWallets,
} from "../../store/reducers/wallet-slice";
import { apiSlice } from "../apiSlice";

const userEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    updateUser: build.mutation<APIData<UserProfile>, any>({
      query: (body) => ({
        url: `/users`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    getUserProfile: build.query<APIData<UserProfile>, void>({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
      providesTags: ["wallet", "user"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        console.log("data", data);
        dispatch(setUserProfile({ profile: data.data }));
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

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserMutation,
} = userEndpoints;
