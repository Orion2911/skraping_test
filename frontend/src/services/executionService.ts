// frontend/src/services/executionService.ts

import api from './api';
import { Execution } from '../types';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

export const executionService = {
  startExecution: async (headless: boolean) => {
    const response = await api.post<Execution>('/execution/start', { headless });
    return response.data;
  },

  stopExecution: async (executionId: number) => {
    const response = await api.post(`/execution/stop/${executionId}`);
    return response.data;
  },

  getExecutionStatus: async (executionId: number) => {
    const response = await api.get<Execution>(`/execution/status/${executionId}`);
    return response.data;
  },

  listExecutions: async (limit: number = 10, offset: number = 0) => {
    const response = await api.get<Execution[]>('/execution/list', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Adicionando o novo método
  getExecutionLogs: async (executionId: number) => {
    const response = await api.get<LogEntry[]>(`/execution/${executionId}/logs`);
    return response.data;
  }
};