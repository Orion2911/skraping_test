// frontend/src/services/api.ts

import axios from 'axios';
import { useSnackbar } from 'notistack';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Base URL da nossa API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { enqueueSnackbar } = useSnackbar();
    const errorMessage = error.response?.data?.detail || 'Erro ao processar requisição';
    enqueueSnackbar(errorMessage, { variant: 'error' });
    return Promise.reject(error);
  }
);

export default api;