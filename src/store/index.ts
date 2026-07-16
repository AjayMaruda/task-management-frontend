import { configureStore } from '@reduxjs/toolkit';
import authReducer, { initializeAuth } from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    tasks: taskReducer,
  },
});

store.dispatch(initializeAuth());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
