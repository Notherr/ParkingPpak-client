import {LatLng} from 'react-native-maps';

declare global {
  type GasStationType =
    | 'SKE'
    | 'GSC'
    | 'HDO'
    | 'SOL'
    | 'FRUGAL'
    | 'RTX'
    | 'NHO'
    | 'RTO'
    | 'ETC'
    | 'RTO';

  type GasStation = {
    id: number;
    compName: GasStationType;
    name: string;
    uniqueId: string;
    address: string;
    lon: number;
    lat: number;
    gasolinePrice: number;
    dieselPrice: number;
    carWash: boolean;
    cvsExist: boolean;
    tel: string;
    distance: number;
  };
}
