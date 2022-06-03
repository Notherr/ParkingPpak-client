import {useMemo} from 'react';
import {baseAPI} from 'api';
import {useSetRecoilState} from 'recoil';
import {LocalAuthState} from 'recoil/atoms';

export default function useUserInfo() {
  const setLocalUser = useSetRecoilState(LocalAuthState);

  return useMemo(
    () => ({
      changeCard: async (cardType: CardType) => {
        try {
          const result = await baseAPI.put<void>(
            `/api/accounts/card-type/${cardType}`,
          );

          return result;
        } catch (error) {
          throw new Error();
        }
      },
      changeOil: async (oilType: OilType) => {
        try {
          const result = await baseAPI.put<OilType>(
            `/api/accounts/oil-type/${oilType}`,
          );
          setLocalUser(curInfo =>
            curInfo ? {...curInfo, oilType: result.data} : null,
          );
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      changeNavigation: async (navigationType: NavigationType) => {
        try {
          const result = await baseAPI.put<NavigationType>(
            `/api/accounts/navi-type/${navigationType}`,
          );
          setLocalUser(curInfo =>
            curInfo ? {...curInfo, naviType: result.data} : null,
          );
          return result;
        } catch (error) {
          throw new Error();
        }
      },
    }),
    [setLocalUser],
  );
}
