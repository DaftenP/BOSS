import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, removeAccessToken, removeRefreshToken } from './token';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Access Token:', token); // 디버깅용 콘솔 출력
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { token: refreshToken });
          const newAccessToken = data.access_token;
          setAccessToken(newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('리프레시 토큰 오류:', refreshError);
          removeAccessToken();
          removeRefreshToken();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
