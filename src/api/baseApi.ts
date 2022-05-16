import {APIService} from './apiService';

// react-native-config 라이브러리 추후 적용예정
// https://velog.io/@ricale/React-Native-%EB%B9%8C%EB%93%9C-%ED%99%98%EA%B2%BD-%EB%B6%84%EB%A6%AC
const baseURL = 'http://localhost:8080';

const baseAPI = new APIService({
  baseURL: baseURL,
  timeout: 5000,
  timeoutErrorMessage: 'Request Timeout',
  validateStatus: status => status < 500,
});

export {baseAPI};
