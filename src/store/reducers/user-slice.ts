import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileSlice {
  profile: UserProfile | null;
}

const initialState: UserProfileSlice = { profile: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfileSlice>) => {
      state.profile = action.payload.profile;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { clearProfile, setUserProfile } = userSlice.actions;
export default userSlice.reducer;
