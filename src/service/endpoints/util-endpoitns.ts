import { SUPPORT_COUNTRIES } from "../../data/supporting-countries";
import { apiSlice } from "../apiSlice";

const utilEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getIcon: build.query<Web3IconData, string>({
      query: (icon) => ({
        url: `https://api.web3icons.io/v1/icons/tokens/${icon}`,
        method: "GET",
        headers: {
          "X-API-Key": "w3i_kcxQRQZrwBJfmDyE3MxiHnQR74T6DrP_",
        },
      }),
      providesTags: ["icons"],
    }),
    getCountries: build.query<CountriesAPI[], void>({
      query: () => ({
        url: `/countries`,
        method: "GET",
      }),
      transformResponse: (response: APIData<CountriesAPI[]>) => {
        return response.data.filter((item) =>
          SUPPORT_COUNTRIES.includes(item.name)
        );
      },
    }),
  }),
});

export const {
  useGetIconQuery,
  useGetCountriesQuery,
  useLazyGetCountriesQuery,
  useLazyGetIconQuery,
} = utilEndpoints;
