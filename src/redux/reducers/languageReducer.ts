import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageMode } from '../../localization/i18n';

interface LanguageState {
  mode: LanguageMode;
}

const initialState: LanguageState = {
  mode: 'system',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguageMode: (state, action: PayloadAction<LanguageMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setLanguageMode } = languageSlice.actions;

export default languageSlice.reducer;
