import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FakeState {
  fakeBalance: number;
}

const initialState: FakeState = {
  fakeBalance: 241, // starting balance, not a mystery number anymore
};

const fakeSlice = createSlice({
  name: 'fake',
  initialState,
  reducers: {
    debit(state, action: PayloadAction<number>) {
      const amount = Math.max(0, action.payload);
      state.fakeBalance = Math.max(0, state.fakeBalance - amount);
    },
    credit(state, action: PayloadAction<number>) {
      const amount = Math.max(0, action.payload);
      state.fakeBalance += amount;
    },
    resetBalance(state) {
      state.fakeBalance = initialState.fakeBalance;
    },
  },
});

export const { debit, credit, resetBalance } = fakeSlice.actions;
export default fakeSlice.reducer;
