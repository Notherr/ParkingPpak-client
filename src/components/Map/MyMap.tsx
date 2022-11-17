import React, {useRef, useState, useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {ActivityIndicator} from 'react-native';
import MapView, {AnimatedRegion} from 'react-native-maps';
import {useRecoilValue, useRecoilState} from 'recoil';
import {
  isShowBottomSheetState,
  selectedInfoState,
  isClickMarkerState,
} from '@/recoil/atoms';
import {
  CustomMarker,
  CenterMarker,
  SearchButton,
  MyLocationButton,
  CustomClusterMapView,
  BottomSheet,
  CurrentLocationMarker,
  SelectMarkerCard,
} from 'components/Map';
import {FlexView} from 'components/common';
import {useContent} from 'recoil/actions';
import {useGetCurrentPosition, useGetOilStationBrandLogo} from 'hooks';

const latitudeDelta = 0.04;
const longitudeDelta = 0.04;

type GoogleMapProps = {
  activeType: ContentType;
  keyword?: string;
};

//scrollTo
function MyMap({activeType, keyword}: GoogleMapProps) {
  const isClickMarker = useRecoilValue(isClickMarkerState);
  const [isShowBottomSheet, setIsShowBottomSheet] = useRecoilState(
    isShowBottomSheetState,
  );
  const [marker, setMarker] = useRecoilState(selectedInfoState);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<MapView>(null);
  const {latitude, longitude} = useGetCurrentPosition();

  const {getMapList} = useContent();

  const [region, setRegion] = useState<Region>({
    latitude: 37.564362,
    longitude: 126.977011,
    latitudeDelta,
    longitudeDelta,
  });

  // 마커 클릭시 bottom sheet가 올라옴
  const onPressMarker = useCallback(
    (type: ContentType, info: GasStation | ParkingLot) => {
      setIsShowBottomSheet(true);
      setMarker(
        type === 'GAS_STATION'
          ? {info: info as GasStation, type}
          : {info: info as ParkingLot, type},
      );
    },
    [],
  );

  // 오일 스테이션 정보를 받아옴
  const {
    data: oilStations,
    refetch: refetchOilStations,
    isFetching: fetchingOilStations,
  } = useQuery(
    ['oilStation'],
    async () => {
      const response = await getMapList(
        `?type=gas_station&lat=${37.5666805}&lon=${126.9784147}`,
      );
      return response.data.map((oilStation: GasStation) => {
        return oilStation;
      });
    },
    {
      enabled: activeType === 'GAS_STATION',
    },
  );

  // 주차장 정보를 받아옴
  const {
    data: parkingLots,
    refetch: refetchParkingLots,
    isFetching: fetchingParkingLots,
  } = useQuery(
    ['parkingLot'],
    async () => {
      const response = await getMapList(
        `?type=parking_lot&lat=${37.5666805}&lon=${126.9784147}`,
      );
      return response.data.map((parkingLot: ParkingLot) => {
        return parkingLot;
      });
    },
    {
      enabled: activeType === 'PARKING_LOT',
    },
  );

  const onRegionChangeComplete = (newRegion: Region, zoom: number) => {
    console.log('여기인가요?', newRegion);
    setIsShowBottomSheet(false);
    setMarker(undefined);
    // setRegion(newRegion);
    setZoom(zoom);
  };

  const onResearchOilStation = () => {
    refetchOilStations();
  };

  const goMyLocation = () => {
    const region = {latitude, longitude, latitudeDelta, longitudeDelta};
    mapRef.current?.animateToRegion(region);
  };

  useEffect(() => {
    console.log(keyword);
  }, [keyword]);

  // if (!region) {
  //   return <ActivityIndicator />;
  // }

  return (
    <MapView
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onRegionChange={(region, details) => console.log(region, details)}
    />
  );
}

export default MyMap;
