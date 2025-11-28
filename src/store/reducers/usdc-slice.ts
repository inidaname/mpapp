import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface USDCWalletState {
  usdcWallet?: TokenBalance | null;
}

const initialState: USDCWalletState = {
  usdcWallet: null,
};

const usdcWalletSlice = createSlice({
  initialState,
  name: "usdc-slice",
  reducers: {
    setUSDCWallet: (state, action: PayloadAction<TokenBalance[]>) => {
      state.usdcWallet = action.payload.find((token) =>
        token.token.symbol === "USDC"
      );
    },
    clearUSDCWallet: () => initialState,
  },
});

export const { clearUSDCWallet, setUSDCWallet } = usdcWalletSlice.actions;

export default usdcWalletSlice.reducer;
