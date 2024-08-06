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
    console.log('Request Config:', config); // 요청 설정 출력z
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
          const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { refresh_token: refreshToken });
          const newAccessToken = data.accessToken; // 여기서 응답 데이터의 키를 확인합니다.
          setAccessToken(newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('리프레시 토큰 오류:', refreshError);
          removeAccessToken();
          removeRefreshToken();
          // 추가적인 로그아웃 처리 등
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
