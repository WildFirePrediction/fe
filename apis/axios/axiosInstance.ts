import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.data?.message) {
      alert(error.response?.data?.message);
    } else {
      alert('네트워크 에러가 발생했습니다.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
