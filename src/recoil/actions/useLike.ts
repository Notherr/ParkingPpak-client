import {useMemo} from 'react';
import {baseAPI} from 'api';

type LikeRequest = {
  type: ContentType;
  dataId: number;
};

export default function useLike() {
  return useMemo(
    () => ({
      addLike: async (body: LikeRequest) => {
        try {
          const result = await baseAPI.post<void>(
            '/api/accounts/favorite-list/',
            {
              type: body.type.replace('_', '-').toLocaleLowerCase(),
              dataId: body.dataId,
            },
          );
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      getMyGasStationList: async () => {
        try {
          const result = await baseAPI.get<GasStation[]>(
            `/api/accounts/favorite-list/gas-station`,
          );
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      getMyParkingLotList: async () => {
        try {
          const result = await baseAPI.get<ParkingLot[]>(
            `/api/accounts/favorite-list/parking-lot`,
          );
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      removeLike: async (body: LikeRequest) => {
        try {
          const result = await baseAPI.delete('/api/accounts/favorite-list/', {
            data: {
              type: body.type.replace('_', '-').toLocaleLowerCase(),
              dataId: body.dataId,
            },
          });
          return result;
        } catch (error) {
          throw new Error();
        }
      },
    }),
    [],
  );
}
