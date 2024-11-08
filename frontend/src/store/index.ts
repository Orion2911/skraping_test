// frontend/src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import executionReducer from './slices/executionSlice';
import keywordReducer from './slices/keywordSlice';

export const store = configureStore({
  reducer: {
    execution: executionReducer,
    keywords: keywordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;