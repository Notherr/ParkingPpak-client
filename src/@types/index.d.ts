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

  type ParkingLot = {
    addRates: number;
    addTimeRates: number;
    address: string;
    holidayBegin: string;
    holidayEnd: string;
    id: number;
    lat: number;
    lng: number;
    modificationDate: string;
    parkingCode: number;
    parkingName: string;
    payYN: false;
    phoneNumber: string;
    rates: number;
    syncTime: string;
    timeRates: number;
    type: string;
    weekdayBegin: string;
    weekdayEnd: string;
    weekendBegin: string;
    weekendEnd: string;
  };

  type GasStation = {
    compName: OIL_STATIONS;
    dieselPrice: number;
    gasolinePrice: number;
    id: number;
    lat: number;
    lng: number;
    name: string;
  };
}
