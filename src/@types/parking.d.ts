export {};

declare global {
  type ParkingLot = {
    addRates: number;
    addTimeRates: number;
    address: string;
    distance: number;
    holidayBegin: string;
    holidayEnd: string;
    id: number;
    lat: number;
    lon: number;
    parkingName: string;
    payYN: boolean;
    rates: number;
    timeRates: number;
    weekdayBegin: string;
    weekdayEnd: string;
    weekendBegin: string;
    weekendEnd: string;
  };
}
