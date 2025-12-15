import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OfflineSlice {
  wallet: string | null;
  offlineBalance: number;
  offline: boolean;
}

const initialState: OfflineSlice = {
  offlineBalance: 0,
  wallet: null,
  offline: false,
};

const offlineSlice = createSlice({
  name: 'offline_slice',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<string>) => {
      state.wallet = action.payload;
    },
    debitOffline(state, action: PayloadAction<number>) {
      const amount = Math.max(0, action.payload);
      state.offlineBalance = Math.max(0, state.offlineBalance - amount);
    },
    creditOffline(state, action: PayloadAction<number>) {
      const amount = Math.max(0, action.payload);
      state.offlineBalance += amount;
    },
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.offline = action.payload;
    },
  },
});

export const { creditOffline, debitOffline, setWallet, setOffline } =
  offlineSlice.actions;

export default offlineSlice.reducer;
