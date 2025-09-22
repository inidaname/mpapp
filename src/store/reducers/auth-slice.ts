import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = { token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    }
  }
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
