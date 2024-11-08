// frontend/src/services/performanceService.ts

import api from './api';
import { PerformanceStats, LideryPosition } from '../types';

export const performanceService = {
  getDailyStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get<PerformanceStats[]>('/performance/daily-stats', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getLideryPositions: async (days: number = 30) => {
    const response = await api.get<LideryPosition[]>('/performance/lidery-positions', {
      params: { days }
    });
    return response.data;
  },

  getExecutionCalendar: async (year: number, month?: number) => {
    const response = await api.get('/performance/execution-calendar', {
      params: { year, month }
    });
    return response.data;
  },
};