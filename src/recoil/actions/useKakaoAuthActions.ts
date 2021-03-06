import {useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSetRecoilState} from 'recoil';
import {kakaoAuthState, isLoading} from 'recoil/atoms';

export default function useKakaoAuthActions() {
  const setKakaoUser = useSetRecoilState(kakaoAuthState);
  const setIsLoading = useSetRecoilState(isLoading);

  return useMemo(
    () => ({
      loginKakao: async (user: KakaoAuthUser) => {
        try {
          await AsyncStorage.setItem('parking-ppak-user', JSON.stringify(user));
          setKakaoUser(user);
        } catch {
          throw new Error('Fail to save userInfo');
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.removeItem('parking-ppak-user');
          setKakaoUser(null);
        } catch {
          throw new Error('Fail to remove user');
        }
      },
      getKakaoLoginInfo: async () => {
        try {
          const user = await AsyncStorage.getItem('parking-ppak-user');
          if (user) {
            setKakaoUser(JSON.parse(user));
          }
          setTimeout(() => setIsLoading(false), 2000);
        } catch {
          throw new Error('Fail to get kakao login Info');
        }
      },
    }),
    [setKakaoUser, setIsLoading],
  );
}
