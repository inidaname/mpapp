import { setUserProfile } from "../../store/reducers/user-slice";
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
      },
    }),
  }),
});

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } =
  userEndpoints;
