import {atom} from 'recoil';

export const kakaoAuthState = atom<KakaoAuthUser | null>({
  key: 'kakaoAuthState',
  default: null,
});

export const LocalAuthState = atom<UserInfo | null>({
  key: 'localAuthState',
  default: null,
});

export const isLoading = atom<boolean>({
  key: 'isLoading',
  default: true,
});
