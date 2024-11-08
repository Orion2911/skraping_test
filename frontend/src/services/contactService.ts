// frontend/src/services/contactService.ts

import api from './api';
import { Contact } from '../types';

export const contactService = {
  listContacts: async (contactType?: string, days: number = 30) => {
    const response = await api.get<Contact[]>('/contacts', {
      params: { contact_type: contactType, days }
    });
    return response.data;
  },

  getCompetitorContacts: async (competitorId: number) => {
    const response = await api.get<Contact[]>(`/contacts/competitor/${competitorId}`);
    return response.data;
  },
};