import React, {useRef, useState, useCallback} from 'react';
import {useQuery} from 'react-query';
import proj4 from 'proj4';
import {ActivityIndicator} from 'react-native';
import MapView from 'react-native-maps';
import {useRecoilValue, useSetRecoilState, useRecoilState} from 'recoil';
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
  SelectMarkerCard,
  CurrentLocationMarker,
} from 'components/Map';
import {FlexView} from 'components/common';
import {getAroundAllOilStation} from 'api';
import {useGetCurrentPosition, useScrollBottomSheet} from 'hooks';

//아래 proj4 라이브러리는 google map의 지도 위치 표기 방법은 WGS84방식, 오피넷의 위치 표기방식은 TM128방식이므로, 이를 서로 변경해주는 작업입니다.
const WGS84 = 'WGS84';
const TM128 = 'TM128';

proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
proj4.defs(
  'TM128',
  '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43',
);

const latitudeDelta = 0.04;
const longitudeDelta = 0.04;

function GoogleMap() {
  const isClickMarker = useRecoilValue(isClickMarkerState);
  const setIsShowBottomSheet = useSetRecoilState(isShowBottomSheetState);
  const [marker, setMarker] = useRecoilState(isMarkerState);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<MapView>(null);
  const {latlng} = useGetCurrentPosition();
  const [region, setRegion] = useState<Region>({
    latitude: 37.564362,
    longitude: 126.977011,
    latitudeDelta,
    longitudeDelta,
  });
  const {DEFAULT_SHOW_SCREEN_HEIGHT} = useScrollBottomSheet();
  const ref = useRef<BottomSheetRefProps>(null);

  const onPressMarker = useCallback((marker: OilStationType) => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      setIsShowBottomSheet(true);
    } else {
      setIsShowBottomSheet(false);
      ref?.current?.scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
    }
    setMarker(marker);
  }, []);

  const tmToWgs = proj4(WGS84, TM128, [region.longitude, region.latitude]);

  const aroundAllParams = {
    x: tmToWgs[0],
    y: tmToWgs[1],
    radius: 5000,
    prodcd: 'B027',
    sort: 2,
  };

  const {
    data: oilStations,
    refetch,
    isFetching,
  } = useQuery(['oilStation'], async () => {
    const response = await getAroundAllOilStation(aroundAllParams);
    return response.map((oilStation: OilStationType) => {
      const wgsToTm = proj4(TM128, WGS84, [
        oilStation.GIS_X_COOR,
        oilStation.GIS_Y_COOR,
      ]);
      (oilStation.GIS_X_COOR = wgsToTm[1]),
        (oilStation.GIS_Y_COOR = wgsToTm[0]);
      return oilStation;
    });
  });

  const onRegionChangeComplete = (newRegion: Region, zoom: number) => {
    ref?.current?.scrollTo(0);
    setIsShowBottomSheet(true);
    setMarker(null);
    setRegion(newRegion);
    setZoom(zoom);
  };

  const onResearchOilStation = () => refetch();

  const goMyLocation = () => {
    const region = {...latlng, latitudeDelta, longitudeDelta};
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
          <CurrentLocationMarker
            latitude={latlng.latitude}
            longitude={latlng.longitude}
          />
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
              key={oilStation.UNI_ID}
              zoom={zoom}
              onPress={onPressMarker}
            />
          ))}
        </CustomClusterMapView>
      </FlexView>
      {isClickMarker && (
        <SearchButton
          icon="refresh"
          name="여기에서 재 검색"
          isFetching={isFetching}
          onPress={onResearchOilStation}
        />
      )}
      <MyLocationButton onPress={goMyLocation} />
      <BottomSheet ref={ref}>
        {marker && <SelectMarkerCard marker={marker} />}
      </BottomSheet>
    </>
  );
}

export default GoogleMap;
