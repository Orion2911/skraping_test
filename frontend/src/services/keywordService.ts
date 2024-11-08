// frontend/src/services/keywordService.ts

import api from './api';
import { Keyword } from '../types';

export const keywordService = {
  listKeywords: async () => {
    const response = await api.get<Keyword[]>('/keywords');
    return response.data;
  },

  addKeywords: async (keywords: string[]) => {
    const response = await api.post<{ added: string[] }>('/keywords', { keywords });
    return response.data;
  },

  deleteKeyword: async (keywordId: number) => {
    const response = await api.delete(`/keywords/${keywordId}`);
    return response.data;
  },

  toggleKeyword: async (keywordId: number) => {
    const response = await api.put(`/keywords/${keywordId}/toggle`);
    return response.data;
  },
};