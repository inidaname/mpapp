import { apiSlice } from "../apiSlice";

const contactEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    addContact: build.mutation<APIData<object>, ContactInput>({
      query: (body) => ({
        url: `/contacts`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["contacts"],
    }),
    getContacts: build.query<
      APIData<ContactData>,
      { search: string; page?: string }
    >({
      query: ({ page = 1, search }) => ({
        url: `/contacts`,
        method: "GET",
        params: { page, search },
      }),
      providesTags: ["contacts"],
    }),
    getContactById: build.query<APIData<object>, string>({
      query: (id) => ({
        url: `/contacts/${id}`,
        method: "GET",
      }),
      providesTags: ["contacts"],
    }),
  }),
});

export const {
  useAddContactMutation,
  useGetContactByIdQuery,
  useGetContactsQuery,
  useLazyGetContactByIdQuery,
  useLazyGetContactsQuery,
} = contactEndpoints;
