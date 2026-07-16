import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface UiState {
  toasts: Toast[];
}

const initialState: UiState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<{ type: ToastType; message: string }>) {
      state.toasts.push({
        id: Date.now().toString(),
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = uiSlice.actions;

export const selectToasts = (state: { ui: UiState }) => state.ui.toasts;

export default uiSlice.reducer;
