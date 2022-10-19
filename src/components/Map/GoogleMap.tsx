import React, {useRef, useState, useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {ActivityIndicator} from 'react-native';
import MapView from 'react-native-maps';
import {useRecoilValue, useRecoilState} from 'recoil';
import {
  isShowBottomSheetState,
  isMarkerState,
  isClickMarkerState,
} from '@/recoil/atoms';
import {
  OilStationMarker,
  CenterMarker,
  SearchButton,
  MyLocationButton,
  CustomClusterMapView,
  BottomSheet,
  CurrentLocationMarker,
  SelectMarkerCard,
} from 'components/Map';
import {FlexView} from 'components/common';
import {useGasStation} from 'recoil/actions';
import {useGetCurrentPosition} from 'hooks';

const latitudeDelta = 0.04;
const longitudeDelta = 0.04;

type GoogleMapProps = {
  activeType: ContentType;
};

//scrollTo
function GoogleMap({activeType}: GoogleMapProps) {
  const isClickMarker = useRecoilValue(isClickMarkerState);
  const [isShowBottomSheet, setIsShowBottomSheet] = useRecoilState(
    isShowBottomSheetState,
  );
  const [marker, setMarker] = useRecoilState(isMarkerState);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<MapView>(null);
  const {latitude, longitude} = useGetCurrentPosition();

  const {getMapList} = useGasStation();

  const [region, setRegion] = useState<Region>({
    latitude: 37.564362,
    longitude: 126.977011,
    latitudeDelta,
    longitudeDelta,
  });

  // 마커 클릭시 bottom sheet가 올라옴
  const onPressMarker = useCallback((marker: GasStation) => {
    setIsShowBottomSheet(true);
    setMarker(marker);
  }, []);

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
      return response.data.map((oilStation: GasStation) => {
        return oilStation;
      });
    },
    {
      enabled: activeType === 'PARKING_LOT',
    },
  );

  const onRegionChangeComplete = (newRegion: Region, zoom: number) => {
    setIsShowBottomSheet(false);
    setMarker(null);
    setRegion(newRegion);
    setZoom(zoom);
  };

  const onResearchOilStation = () => refetchOilStations();

  const goMyLocation = () => {
    const region = {latitude, longitude, latitudeDelta, longitudeDelta};
    mapRef.current?.animateToRegion(region);
  };

  if (!region) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <FlexView style={{position: 'relative'}}>
        <CustomClusterMapView
          ref={mapRef}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}>
          <CurrentLocationMarker latitude={latitude} longitude={longitude} />
          <CenterMarker
            isFetching={fetchingOilStations || fetchingParkingLots}
            center={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
          {activeType === 'GAS_STATION' &&
            oilStations?.map(oilStation => (
              <OilStationMarker
                selectMarker={marker}
                marker={oilStation}
                key={oilStation.id}
                zoom={zoom}
                onPress={onPressMarker}
              />
            ))}
          {/* {activeType === 'PARKING_LOT' &&
            parkingLots?.map(parking => (
              <OilStationMarker
                selectMarker={marker}
                marker={parking}
                key={parking.id}
                zoom={zoom}
                onPress={onPressMarker}
              />
            ))} */}
        </CustomClusterMapView>
      </FlexView>
      {!isShowBottomSheet && (
        <SearchButton
          icon="refresh"
          name="여기에서 재 검색"
          isFetching={fetchingOilStations || fetchingParkingLots}
          onPress={onResearchOilStation}
        />
      )}
      <MyLocationButton onPress={goMyLocation} />
      <BottomSheet showBottomSheet={!!marker}>
        {marker && <SelectMarkerCard marker={marker} />}
      </BottomSheet>
    </>
  );
}

export default GoogleMap;
