import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Payload = OfflineTransactions;

const initialState: { transactions: OfflineTransactions[] } = {
  transactions: [],
};

const offlineTransactionsSlice = createSlice({
  name: 'OFFLINE_TRANSACTIONS',
  initialState,
  reducers: {
    addOfflineTransaction: (state, action: PayloadAction<Payload>) => {
      state.transactions.push({
        ...action.payload,
        synced: action.payload.synced ?? false,
      });
    },

    updateOfflineTransaction: (
      state,
      action: PayloadAction<UpdateTransaction>,
    ) => {
      const tx = state.transactions.find(
        t => t.reference === action.payload.reference,
      );

      if (!tx) return;

      tx.status = action.payload.status;
      if (action.payload.synced !== undefined) {
        tx.synced = action.payload.synced;
      }
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      const transactions = state.transactions.filter(
        t => t.reference !== action.payload,
      );
      return { transactions };
    },
    markAsSynced: (state, action: PayloadAction<string>) => {
      const tx = state.transactions.find(t => t.reference === action.payload);
      if (!tx) return;
      tx.synced = true;
    },
    resetOfflineTransactions: () => initialState,
  },
});

export const {
  addOfflineTransaction,
  updateOfflineTransaction,
  markAsSynced,
  removeTransaction,
  resetOfflineTransactions,
} = offlineTransactionsSlice.actions;

export default offlineTransactionsSlice.reducer;
