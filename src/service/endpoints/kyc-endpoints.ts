import { setKYCStatus } from '../../store/reducers/kyc-status-slice';
import { apiSlice } from '../apiSlice';

const kycEndpoints = apiSlice.injectEndpoints({
  endpoints: build => ({
    startKYC: build.mutation<APIData<KYCDetail>, void>({
      query: () => ({
        url: `/kyc`,
        method: 'POST',
      }),
      invalidatesTags: ['user'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data.data.metadata.kyc.kyc_status === 'approved') {
          dispatch(setKYCStatus(true));
        }
      },
    }),
    getKYC: build.query<APIData<KYCDetail>, void>({
      query: () => ({
        url: `/kyc`,
        method: 'GET',
      }),
      providesTags: ['user'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data.data.metadata.kyc.kyc_status === 'approved') {
          dispatch(setKYCStatus(true));
        }
      },
    }),
  }),
});

export const { useGetKYCQuery, useLazyGetKYCQuery, useStartKYCMutation } =
  kycEndpoints;
