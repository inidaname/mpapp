import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScanWalletSlice {
  address: string | null;
  scanned: boolean;
}

const initialState: ScanWalletSlice = {
  address: null,
  scanned: false,
};

const scanWalletSlice = createSlice({
  initialState,
  name: "scanWalletSlice",
  reducers: {
    setScannedAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setScanned: (state, action: PayloadAction<boolean>) => {
      state.scanned = action.payload;
    },
    clearScannedAddress: () => initialState,
  },
});

export const { clearScannedAddress, setScannedAddress, setScanned } =
  scanWalletSlice.actions;

export default scanWalletSlice.reducer;
