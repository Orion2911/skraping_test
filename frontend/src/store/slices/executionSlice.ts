// frontend/src/store/slices/executionSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { executionService } from '../../services/executionService';
import { Execution } from '../../types';

interface ExecutionState {
  currentExecution: Execution | null;
  executions: Execution[];
  loading: boolean;
  error: string | null;
}

const initialState: ExecutionState = {
  currentExecution: null,
  executions: [],
  loading: false,
  error: null,
};

// Agora usamos o executionService em vez do axios diretamente
export const startExecution = createAsyncThunk(
  'execution/start',
  async (headless: boolean) => {
    return await executionService.startExecution(headless);
  }
);

export const stopExecution = createAsyncThunk(
  'execution/stop',
  async (executionId: number) => {
    return await executionService.stopExecution(executionId);
  }
);

export const fetchExecutions = createAsyncThunk(
  'execution/fetchAll',
  async () => {
    return await executionService.listExecutions();
  }
);

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startExecution.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExecution = action.payload;
      })
      .addCase(startExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to start execution';
      })
      .addCase(stopExecution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stopExecution.fulfilled, (state) => {
        state.loading = false;
        state.currentExecution = null;
      })
      .addCase(stopExecution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to stop execution';
      })
      .addCase(fetchExecutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExecutions.fulfilled, (state, action) => {
        state.loading = false;
        state.executions = action.payload;
      })
      .addCase(fetchExecutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch executions';
      });
  },
});

export default executionSlice.reducer;