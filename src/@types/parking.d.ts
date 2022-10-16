export {};

declare global {
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
}
