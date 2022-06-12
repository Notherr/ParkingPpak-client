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

  // 데이터 타입 확인 필요
  type ParkingLot = {
    id: number;
    add_rates: number;
    add_time_rates: number;
    address: string;
    holiday_begin: string;
    holiday_end: string;
    modification_date: number;
    parking_code: string;
    parking_name: string;
    payyn: boolean;
    phone_number: number;
    rates: number;
    sync_time: string;
    time_rates: string;
    type: number;
    weekday_begin: string;
    weekday_end: string;
    weekend_begin: string;
    weekend_end: string;
    x_coor: number;
    y_coor: number;
  };

  // 추가 필요
  type GasStation = {
    id: number;
    compName: string;
    xCoor: number;
    yCoor: number;
  };
}
