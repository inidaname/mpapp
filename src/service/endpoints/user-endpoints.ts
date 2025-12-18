import { setUserProfile } from '../../store/reducers/user-slice';
import {
  setActiveWallet,
  setActiveWalletAddrees,
  setWallets,
} from '../../store/reducers/wallet-slice';
import { apiSlice } from '../apiSlice';

const userEndpoints = apiSlice.injectEndpoints({
  endpoints: build => ({
    updateUser: build.mutation<APIData<UserProfile>, any>({
      query: body => ({
        url: `/users`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['user'],
    }),
    getUserProfile: build.query<APIData<UserProfile>, void>({
      query: () => ({
        url: `/users/profile`,
        method: 'GET',
      }),
      providesTags: ['wallet', 'user'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          const profile = data.data;
          const wallets = profile.Wallet || [];
          console.log('wallets', wallets);
          const activeWallet = wallets.find(w => w.is_active);

          dispatch(setUserProfile({ profile }));
          dispatch(setWallets(wallets));

          if (activeWallet) {
            dispatch(setActiveWallet(activeWallet));
            dispatch(setActiveWalletAddrees(activeWallet.wallet_address));
            await dispatch(
              (apiSlice.endpoints as any).getWalletById.initiate(
                activeWallet.id,
              ),
            );
          } else {
            // no wallet or failed to find one, create a new wallet
            try {
              await dispatch(
                (apiSlice.endpoints as any).createWallet.initiate({
                  accountType: 'EOA',
                  blockchains: ['SOL-DEVNET'],
                }),
              ).unwrap();

              // update redux store with the new wallet
              dispatch(
                (apiSlice.endpoints as any).getUserProfile.initiate(undefined, {
                  forceRefetch: true,
                }),
              );
            } catch (createErr) {
              console.log('wallet creation failed:', createErr);
            }
          }
        } catch (err) {
          console.log('profile fetch failed:');
        }
      },
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserMutation,
} = userEndpoints;
