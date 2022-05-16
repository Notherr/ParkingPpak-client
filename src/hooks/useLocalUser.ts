import {useRecoilValue} from 'recoil';
import {LocalAuthState} from 'recoil/atoms';

export default function useLocalUser() {
  const localAuth = useRecoilValue(LocalAuthState);
  return localAuth;
}
