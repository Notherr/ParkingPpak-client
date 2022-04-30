import {useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseAPI} from 'api';
import {useSetRecoilState} from 'recoil';
import {LocalAuthState} from 'recoil/atoms';

export default function useLocalAuthActions() {
  const setLocalUser = useSetRecoilState(LocalAuthState);

  return useMemo(
    () => ({
      join: async (user: RegisterRequest) => {
        try {
          return await baseAPI.post('/api/join', user);
        } catch (error) {
          return error;
        }
      },
      login: async (user: LoginRequest) => {
        try {
          return await baseAPI.post('/api/login', user);
        } catch (error) {
          return error;
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.removeItem('parking-ppak-user');
          setLocalUser(null);
        } catch (error) {
          return error;
        }
      },
    }),
    [setLocalUser],
  );
}
