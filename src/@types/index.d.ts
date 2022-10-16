export {};

declare global {
  type ContentType = 'GAS_STATION' | 'PARKING_LOT';

  type Nullable<T> = null | undefined | T;

  type APIData<T> = {
    statusCode: number;
    data: T;
    message: string;
  };

  type ItemCard<T> = {
    logo: T;
    title: T;
  };
}
