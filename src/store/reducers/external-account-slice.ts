import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExternalAccountSlice {
  account: ExternalAccountDetail | null;
  account_id: string | null;
}

const initialState: ExternalAccountSlice = {
  account: null,
  account_id: null,
};

const externalAccountSlice = createSlice({
  initialState,
  name: "externalAccountSlice",
  reducers: {
    setExternalAccountId: (state, action: PayloadAction<string>) => {
      state.account_id = action.payload;
    },
    setExternalAccountDetail: (
      state,
      action: PayloadAction<ExternalAccountDetail>,
    ) => {
      state.account = action.payload;
    },
    clearExternalAccountAll: () => initialState,
  },
});

export const {
  clearExternalAccountAll,
  setExternalAccountDetail,
  setExternalAccountId,
} = externalAccountSlice.actions;

export default externalAccountSlice.reducer;
