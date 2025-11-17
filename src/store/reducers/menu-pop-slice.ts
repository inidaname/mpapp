import { createSlice } from "@reduxjs/toolkit";

interface PopOut {
  isMenuOpen: boolean;
}

const initialState: PopOut = { isMenuOpen: false };

const menuPopSlice = createSlice({
  initialState,
  name: "menuPopOut",
  reducers: {
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    openMenu: (state) => {
      state.isMenuOpen = true;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { closeMenu, openMenu, toggleMenu } = menuPopSlice.actions;

export default menuPopSlice.reducer;
