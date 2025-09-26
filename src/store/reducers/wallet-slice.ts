import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletSlice {
  active_wallet_address: string | null;
  wallets: WalletData[];
  active_wallet: WalletData | null;
}

const initialState: WalletSlice = {
  active_wallet_address: null,
  wallets: [],
  active_wallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<WalletData[]>) => {
      state.wallets = action.payload;
    },
    setActiveWallet: (state, action: PayloadAction<WalletData>) => {
      state.active_wallet = action.payload;
    },
    // removeWallet: (state, action: PayloadAction<string>) => {
    //   state.wallets = state.wallets.filter(
    //     (wallet) => wallet.wallet_address !== action.payload,
    //   );
    //   if (state.active_wallet_address === action.payload) {
    //     state.active_wallet_address = null;
    //   }
    // },
    setActiveWalletAddrees: (state, action: PayloadAction<string | null>) => {
      state.active_wallet_address = action.payload;
    },
    clearWallets: (state) => {
      state.wallets = [];
      state.active_wallet_address = null;
    },
  },
});

export const {
  setWallets,
  setActiveWalletAddrees,
  setActiveWallet,
  clearWallets,
} = walletSlice.actions;

export default walletSlice.reducer;
