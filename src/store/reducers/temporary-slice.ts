import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TempSlice {
  token: string | null;
  user_id: string | null;
}

const initialState: TempSlice = { token: null, user_id: null };

const tempSlice = createSlice({
  name: "temporary",
  initialState,
  reducers: {
    setTokenTempe: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserTemp: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    clearTempToken: () => initialState,
  },
});

export const { clearTempToken, setTokenTempe, setUserTemp } = tempSlice.actions;
export default tempSlice.reducer;
