import {useMemo} from 'react';
import {baseAPI} from 'api';

export default function useContent() {
  return useMemo(
    () => ({
      getContentList: async (query: string) => {
        try {
          const result = await baseAPI.get<any[]>(`/api/search/map${query}`);
          return result;
        } catch (error) {
          throw new Error();
        }
      },
      getDetailContent: async (query: string) => {
        try {
          const result = await baseAPI.get<unknown>(
            `/api/search/map/detail${query}`,
          );
          return result as unknown;
        } catch (error) {
          throw new Error();
        }
      },
    }),
    [],
  );
}
