import {useMemo} from 'react';
import {baseAPI} from 'api';
import authStorage from '@/storages/authStorage';
import {useSetRecoilState} from 'recoil';
import {LocalAuthState} from 'recoil/atoms';

export default function useLocalAuthActions() {
  const setLocalUser = useSetRecoilState(LocalAuthState);

  return useMemo(
    () => ({
      join: async (user: RegisterRequest) => {
        try {
          const result = await baseAPI.post<void>('/api/join', user);
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      login: async (user: LoginRequest) => {
        try {
          const result = await baseAPI.post<UserInfo>('/api/login', user);
          if (result.statusCode === 200) {
            setLocalUser(result.data);
            authStorage.set(result.data);
          }
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      logout: async () => {
        try {
          await authStorage.clear();
          setLocalUser(null);
        } catch (error) {
          return error;
        }
      },
    }),
    [setLocalUser],
  );
}
