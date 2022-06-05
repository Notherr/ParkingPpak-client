import React, {useRef, useState, useCallback} from 'react';
import {useQuery} from 'react-query';
import proj4 from 'proj4';
import {Image, ActivityIndicator} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {isShowBottomSheet, isMarkerInfo} from '@/recoil/atoms';
import {
  OilStationMarker,
  CenterMarker,
  SearchButton,
  MyLocationButton,
  CustomClusterMapView,
  BottomSheet,
} from 'components/Map';
import {FlexView} from 'components/common';
import {getAroundAllOilStation} from 'api';
import images from 'assets/images';
import {Text} from 'react-native-svg';
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
  const isShowBottomSheetState = useRecoilValue(isShowBottomSheet);
  const setIsShowBottomSheetState = useSetRecoilState(isShowBottomSheet);
  const setIsMarkerInfo = useSetRecoilState(isMarkerInfo);
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

  const onPress = useCallback(marker => {
    const isActive = ref?.current?.isActive();
    setIsMarkerInfo(marker);
    if (isActive) {
      console.log('@11@');
      setIsShowBottomSheetState(true);
      // ref?.current?.scrollTo(0);
    } else {
      console.log('@22@');
      setIsShowBottomSheetState(false);
      ref?.current?.scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
    }
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
    setIsShowBottomSheetState(true);
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

  console.log('oilStations>>>,', oilStations);

  return (
    <>
      <FlexView style={{position: 'relative'}}>
        <CustomClusterMapView
          ref={mapRef}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}>
          <Marker coordinate={latlng}>
            <Image
              source={images.MapMarker}
              style={{width: 30, height: 30}}
              resizeMode="cover"
            />
          </Marker>
          <CenterMarker
            isFetching={isFetching}
            center={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />

          {oilStations?.map(oilStation => (
            <OilStationMarker
              marker={oilStation}
              key={oilStation.UNI_ID}
              zoom={zoom}
              // title={oilStation.OS_NM}
              // brandName={oilStation.POLL_DIV_CD}
              // coordinate={{
              // longitude: oilStation.GIS_Y_COOR,
              // latitude: oilStation.GIS_X_COOR,
              // }}
              // price={oilStation.PRICE}
              onPress={onPress}
              // onPress={() => console.log('@@@')}
            />
          ))}
        </CustomClusterMapView>
      </FlexView>
      {isShowBottomSheetState && (
        <SearchButton
          icon="refresh"
          name="여기에서 재 검색"
          isFetching={isFetching}
          onPress={onResearchOilStation}
        />
      )}
      <MyLocationButton onPress={goMyLocation} />
      <BottomSheet ref={ref}>
        <Text>12</Text>
      </BottomSheet>
    </>
  );
}

export default GoogleMap;
