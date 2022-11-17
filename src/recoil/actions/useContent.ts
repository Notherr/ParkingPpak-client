import {useMemo} from 'react';
import {baseAPI} from 'api';

export default function useContent() {
  return useMemo(
    () => ({
      getMapList: async (query: string) => {
        try {
          const result = await baseAPI.get<any[]>(`/api/search/map${query}`);
          return result;
        } catch (error) {
          throw new Error();
        }
      },
    }),
    [],
  );
}
