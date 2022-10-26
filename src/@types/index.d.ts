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

  type GasStationWrapper = {
    type: 'GAS_STATION';
    info: GasStation;
  };

  type ParkingLotWrapper = {
    type: 'PARKING_LOT';
    info: ParkingLot;
  };
}
