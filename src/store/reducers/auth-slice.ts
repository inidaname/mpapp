import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
  token: string | null;
  user_id: string | null;
  hasOnboarded: boolean;
}

const initialState: AuthSlice = {
  token: null,
  user_id: null,
  hasOnboarded: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<AuthSlice | null>,
    ) => {
      state.token = action.payload?.token ?? null;
      state.user_id = action.payload?.user_id ?? null;
    },
    setHasOnboarded: (state, action: PayloadAction<boolean>) => {
      state.hasOnboarded = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.user_id = null;
    },
  },
});

export const { setToken, setHasOnboarded, clearToken } = authSlice.actions;
export default authSlice.reducer;
