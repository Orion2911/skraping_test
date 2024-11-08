// frontend/src/store/slices/keywordSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Keyword } from '../../types';

interface KeywordState {
  items: Keyword[];
  loading: boolean;
  error: string | null;
}

const initialState: KeywordState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchKeywords = createAsyncThunk(
  'keywords/fetchAll',
  async () => {
    const response = await axios.get('/api/v1/keywords');
    return response.data;
  }
);

export const addKeywords = createAsyncThunk(
  'keywords/add',
  async (keywords: string[]) => {
    const response = await axios.post('/api/v1/keywords', { keywords });
    return response.data;
  }
);

export const deleteKeyword = createAsyncThunk(
  'keywords/delete',
  async (id: number) => {
    await axios.delete(`/api/v1/keywords/${id}`);
    return id;
  }
);

export const toggleKeyword = createAsyncThunk(
  'keywords/toggle',
  async (id: number) => {
    const response = await axios.put(`/api/v1/keywords/${id}/toggle`);
    return response.data;
  }
);

const keywordSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch keywords';
      })
      // Adicione outros casos para as outras ações
  },
});

export default keywordSlice.reducer;