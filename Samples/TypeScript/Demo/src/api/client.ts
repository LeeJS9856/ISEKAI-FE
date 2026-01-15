import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// 매 요청마다 localStorage에서 accessToken을 가져와 헤더에 추가
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
