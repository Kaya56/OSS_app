import { useState } from 'react';
import axios from 'axios';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = async (requestFn: () => Promise<T>) => {
    setResponse({ data: null, loading: true, error: null });
    try {
      const data = await requestFn();
      setResponse({ data, loading: false, error: null });
    } catch (error) {
      setResponse({
        data: null,
        loading: false,
        error: axios.isAxiosError(error) ? error.response?.data.message || 'Erreur serveur' : 'Erreur inconnue',
      });
    }
  };

  return { ...response, request };
};