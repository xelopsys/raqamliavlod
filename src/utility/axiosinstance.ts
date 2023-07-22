/* eslint-disable no-param-reassign */
import axios from 'axios';
import toast from 'react-hot-toast';
import { store } from '@/context/store/store';
import { logout } from '@/context/slice/auth-slice';

const axiosinstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  transformResponse: [...(axios.defaults.transformResponse as any)],
  transformRequest: [...(axios.defaults.transformRequest as any)],
});

axiosinstance.interceptors.request.use(
  (config: any) => {
    const token = store?.getState()?.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = 'uz';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosinstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const token = store?.getState()?.auth.token;

    if (error.response.status === 500) {
      toast.error(error.response.statusText);
      return Promise.reject(error);
    }

    if (error.response.status === 422) {
      toast.error(error.response.statusText);
      return Promise.reject(error);
    }

    if (error?.response?.status === 404) {
      // toast.error(error.response.data.error?.message || 'Topilmadi');
      return Promise.reject(error);
    }
    if (error?.response?.status === 401) {
      if (token) logout();
      toast.error("Iltimos ro'yxatdan o'ting");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosinstance;
