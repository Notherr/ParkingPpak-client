import {LatLng} from 'react-native-maps';

declare global {
  type Map = 'Map';

  type CustomMarker = {
    id: number;
    name: string;
    src: string;
    description: string;
    area: string;
    place: string;
    food: string;
    location: Location;
    icon: string;
    coordinate?: LatLng;
    stopPropagation?: boolean;
  };

  type Location = {
    latitude: number;
    longitude: number;
  };

  type Region = Location & {
    latitudeDelta: number;
    longitudeDelta: number;
  };

  type MapInfo = {
    MARKERS: CustomMarker[];
    categories: any[];
    region: Region;
  };

  type AroundAllOilStationParamsType = {
    x: number;
    y: number;
    radius: number;
    prodcd: string;
    sort: number;
  };

  type Geometry = {
    type: string;
    coordinates: [number, number];
  };

  type ClusterMarkerProperties = {
    cluster: boolean;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: number;
  };

  type ViewPropertiesMarkerProps = {
    coordinate: LatLng;
    stopPropagation: boolean;
  };

  type GeoJSONFeatureType = {
    type: string;
    geometry: {
      coordinates: number[];
      type: string;
    };
    properties: {
      coordinate: {
        latitude: number;
        longitude: number;
      };
      stopPropagation: boolean;
      point_count: number;
      index: number;
    };
  };

  type BottomSheetProps = {
    children: ReactNode | undefined;
  };

  export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
  };
}
