// frontend/src/services/competitionService.ts

import api from './api';
import { Competitor, CompetitorDetails } from '../types';

export const competitionService = {
  getTopCompetitors: async (limit: number = 10, days: number = 30) => {
    const response = await api.get<Competitor[]>('/competition/top-competitors', {
      params: { limit, days }
    });
    return response.data;
  },

  getCompetitorDetails: async (competitorId: number) => {
    const response = await api.get<CompetitorDetails>(`/competition/competitor/${competitorId}/details`);
    return response.data;
  },
};