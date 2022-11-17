import authStorage from '@/storages/authStorage';
import {AxiosRequestConfig} from 'axios';
import {APIService} from './apiService';

// const baseURL = 'http://3.34.193.83:80';
const baseURL = 'http://localhost:8080';

const baseAPI = new APIService({
  baseURL: baseURL,
  timeout: 5000,
  timeoutErrorMessage: 'Request Timeout',
  validateStatus: status => status < 500,
});

const appendToken = async (config: AxiosRequestConfig) => {
  console.log(config);
  const userInfo = await authStorage.get();
  if (userInfo) {
    const {jwt} = userInfo;
    return {
      ...config,
      headers: {
        Authorization: jwt,
      },
    };
  }
  return {
    headers: {},
    ...config,
  };
};

baseAPI.instance.interceptors.request.use(appendToken);
baseAPI.instance.interceptors.response.use(res => {
  console.log(res);
  return res;
});

export {baseAPI};
