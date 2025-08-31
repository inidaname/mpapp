import { apiSlice } from "../apiSlice";

const utilEndpoints = apiSlice.injectEndpoints({
  endpoints: build => ({
    getIcon: build.query<Web3IconData, string>({
      query: icon => ({
        url: `https://api.web3icons.io/v1/icons/tokens/${icon}`,
        method: "GET",
        headers: {
          "X-API-Key": "w3i_kcxQRQZrwBJfmDyE3MxiHnQR74T6DrP_"
        }
      }),
      providesTags: [ "icons" ]
    })
  })
})

export const { useGetIconQuery } = utilEndpoints