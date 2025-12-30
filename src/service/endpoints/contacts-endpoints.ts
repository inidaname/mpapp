import { isWalletAddress } from '../../helpers/is-wallet-address';
import { generateUsername } from '../../helpers/username';
import { apiSlice } from '../apiSlice';

const contactEndpoints = apiSlice.injectEndpoints({
  endpoints: build => ({
    addContact: build.mutation<APIData<object>, ContactInput>({
      query: body => ({
        url: `/contacts`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['contacts'],
    }),
    getContacts: build.query<
      APIData<ContactData>,
      { search: string; page?: number }
    >({
      query: ({ page = 1, search }) => ({
        url: `/contacts`,
        method: 'GET',
        params: { page, search },
      }),
      providesTags: ['contacts'],
    }),
    searchContact: build.query<
      { username: string; address: string } | null,
      string
    >({
      query: search => ({
        url: `/contacts/search`,
        method: 'GET',
        params: { search },
      }),
      transformResponse(response: APIData<UserProfile | null>, _, search) {
        if (response.data) {
          const walletAddress =
            response.data.Wallet?.find(wallet => wallet.blockchain?.length)
              ?.wallet_address ?? '';

          return {
            username: response.data.username ?? '',
            address: walletAddress,
          };
        }

        if (isWalletAddress(search)) {
          return {
            username: generateUsername(),
            address: search,
          };
        }

        return null;
      },
    }),
    getContactById: build.query<APIData<object>, string>({
      query: id => ({
        url: `/contacts/${id}`,
        method: 'GET',
      }),
      providesTags: ['contacts'],
    }),
  }),
});

export const {
  useAddContactMutation,
  useGetContactByIdQuery,
  useGetContactsQuery,
  useLazyGetContactByIdQuery,
  useLazyGetContactsQuery,
  useSearchContactQuery,
  useLazySearchContactQuery,
} = contactEndpoints;
