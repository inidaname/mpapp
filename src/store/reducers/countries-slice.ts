import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountrySlice {
  supported: CountriesAPI[];
  user_country: CountriesAPI | null;
}

const initialState: CountrySlice = {
  supported: [],
  user_country: null,
};

const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSupportedCountries: (state, action: PayloadAction<CountriesAPI[]>) => {
      state.supported = action.payload;
    },
    setUserCountry: (state, action: PayloadAction<CountriesAPI>) => {
      state.user_country = action.payload;
    },
    clearUserCountry: (state) => {
      state.user_country = null;
    },
  },
});

export const { setSupportedCountries, setUserCountry, clearUserCountry } =
  countrySlice.actions;

export default countrySlice.reducer;
