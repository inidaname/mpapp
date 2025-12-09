import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CopyContentSlice {
  globalContent: string | null;
}

const initialState: CopyContentSlice = { globalContent: null };

const copyContentSlice = createSlice({
  name: 'copycontentslice',
  initialState,
  reducers: {
    setCopyContent: (state, action: PayloadAction<string>) => {
      state.globalContent = action.payload;
    },
    clearCopyContent: () => initialState,
  },
});

export const { clearCopyContent, setCopyContent } = copyContentSlice.actions;
export default copyContentSlice.reducer;
