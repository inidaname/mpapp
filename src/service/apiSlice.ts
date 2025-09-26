import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as Keychain from "react-native-keychain";
import { SERVICE_NAME } from "../config/TOKEN";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://devapi.insfers.com/",
  mode: "cors",
  prepareHeaders: async (headers) => {
    try {
      const creds = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });

      if (creds) {
        headers.set("authorization", `Bearer ${creds.password}`);
      }
    } catch (err) {
      console.warn("No token found", err);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["icons", "balance"],
});
