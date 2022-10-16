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
import {useMap} from 'recoil/actions';
import {useGetCurrentPosition} from 'hooks';

const latitudeDelta = 0.04;
const longitudeDelta = 0.04;

//scrollTo
function GoogleMap() {
  const isClickMarker = useRecoilValue(isClickMarkerState);
  const [isShowBottomSheet, setIsShowBottomSheet] = useRecoilState(
    isShowBottomSheetState,
  );
  const [marker, setMarker] = useRecoilState(isMarkerState);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<MapView>(null);
  const {latitude, longitude} = useGetCurrentPosition();

  const {getMapList} = useMap();

  const [region, setRegion] = useState<Region>({
    latitude: 37.564362,
    longitude: 126.977011,
    latitudeDelta,
    longitudeDelta,
  });

  // 마커 클릭시 bottom sheet가 올라옴
  const onPressMarker = useCallback((marker: OilStationType) => {
    setIsShowBottomSheet(true);
    setMarker(marker);
  }, []);

  // 오일 스테이션 정보를 받아옴
  // 아마 공공api를 쓰는듯
  const {
    data: oilStations,
    refetch,
    isFetching,
  } = useQuery(['oilStation'], async () => {
    const response = await getMapList(
      `?type=gas_station&lat=${37.5666805}&lon=${126.9784147}`,
    );
    return response.data.map((oilStation: OilStationType) => {
      return oilStation;
    });
  });

  const onRegionChangeComplete = (newRegion: Region, zoom: number) => {
    setIsShowBottomSheet(false);
    setMarker(null);
    setRegion(newRegion);
    setZoom(zoom);
  };

  const onResearchOilStation = () => refetch();

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
            isFetching={isFetching}
            center={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />

          {oilStations?.map(oilStation => (
            <OilStationMarker
              selectMarker={marker}
              marker={oilStation}
              key={oilStation.id}
              zoom={zoom}
              onPress={onPressMarker}
            />
          ))}
        </CustomClusterMapView>
      </FlexView>
      {!isShowBottomSheet && (
        <SearchButton
          icon="refresh"
          name="여기에서 재 검색"
          isFetching={isFetching}
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
