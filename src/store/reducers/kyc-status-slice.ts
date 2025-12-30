import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KYCStatus {
  isKYCDone: boolean;
}

const initialState: KYCStatus = {
  isKYCDone: false,
};

const kycStatusSlice = createSlice({
  name: 'KYC_STATUS_SLICE',
  initialState,
  reducers: {
    setKYCStatus: (state, action: PayloadAction<boolean>) => {
      state.isKYCDone = action.payload;
    },
    clearKYCStatus: () => initialState,
  },
});

export const { clearKYCStatus, setKYCStatus } = kycStatusSlice.actions;

export default kycStatusSlice.reducer;
