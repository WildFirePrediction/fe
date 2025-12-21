import axios from 'axios';
import { getDeviceId } from '../../utils/deviceId';

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const deviceId = await getDeviceId();
    (config.headers as any)['X-DEVICE-UUID'] = deviceId;
    return config;
  },
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
