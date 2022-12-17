import React, {useRef, useState, useCallback, useEffect} from 'react';
import {useQuery} from 'react-query';
import {ActivityIndicator} from 'react-native';
import MapView, {Region} from 'react-native-maps';
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
function GoogleMap({activeType, keyword}: GoogleMapProps) {
  const isClickMarker = useRecoilValue(isClickMarkerState);
  const [isShowBottomSheet, setIsShowBottomSheet] = useRecoilState(
    isShowBottomSheetState,
  );
  const [marker, setMarker] = useRecoilState(selectedInfoState);
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<MapView>(null);
  const currentCoord = useGetCurrentPosition();

  const {getContentList} = useContent();

  const [region, setRegion] = useState<Region>();

  useEffect(() => {
    if (currentCoord.latitude && currentCoord.longitude) {
      console.log(currentCoord);
      setRegion({
        latitudeDelta,
        longitudeDelta,
        latitude: 37.564362,
        longitude: 126.977011,
      });
    }
  }, [currentCoord]);

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
      const response = await getContentList(
        `?type=gas_station&lat=${37.5666805}&lon=${126.9784147}${
          keyword ? `&keyword=${keyword}` : ''
        }`,
      );
      if (!response.data) {
        return [];
      }
      // console.log(response.data);
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
      const response = await getContentList(
        `?type=parking_lot&lat=${37.5666805}&lon=${126.9784147}${
          keyword ? `&keyword=${keyword}` : ''
        }`,
      );
      if (!response.data) {
        return [];
      }
      return response.data.map((parkingLot: ParkingLot) => {
        return parkingLot;
      });
    },
    {
      enabled: activeType === 'PARKING_LOT',
    },
  );

  const onRegionChangeComplete = (newRegion: Region, zoom: number) => {
    setIsShowBottomSheet(false);
    setMarker(undefined);
    // setRegion(newRegion);
    setZoom(zoom);
  };

  const onResearchOilStation = () => {
    refetchOilStations();
  };

  const goMyLocation = () => {
    const region = {...currentCoord, latitudeDelta, longitudeDelta};
    mapRef.current?.animateToRegion(region);
  };

  useEffect(() => {
    console.log(keyword);
    if (keyword !== undefined) {
      if (activeType === 'GAS_STATION') {
        refetchOilStations();
      } else {
        refetchParkingLots();
      }
    }
  }, [keyword]);

  if (!region) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <FlexView style={{position: 'relative'}}>
        <CustomClusterMapView
          ref={mapRef}
          activeType={activeType}
          initialRegion={region}
          onRegionChangeComplete={onRegionChangeComplete}>
          <CurrentLocationMarker
            latitude={region.latitude}
            longitude={region.longitude}
          />
          <CenterMarker
            isFetching={fetchingOilStations || fetchingParkingLots}
            center={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
          {activeType === 'GAS_STATION' &&
            oilStations?.map(oilStation => (
              <CustomMarker
                title={`${oilStation.gasolinePrice.toLocaleString()}원`}
                logo={useGetOilStationBrandLogo(oilStation.compName)?.logo}
                selected={marker?.info.id === oilStation.id}
                key={oilStation.id}
                zoom={zoom}
                coordinate={{
                  longitude: oilStation.lon,
                  latitude: oilStation.lat,
                }}
                onPress={() => onPressMarker('GAS_STATION', oilStation)}
              />
            ))}
          {activeType === 'PARKING_LOT' &&
            parkingLots?.map(parking => (
              <CustomMarker
                title={`${
                  parking.rates === 0
                    ? '무료주차장'
                    : `${parking.addTimeRates}분당 ${parking.rates}원`
                }`}
                selected={marker?.info.id === parking.id}
                key={parking.id}
                zoom={zoom}
                coordinate={{
                  longitude: parking.lon,
                  latitude: parking.lat,
                }}
                onPress={() => onPressMarker('PARKING_LOT', parking)}
              />
            ))}
        </CustomClusterMapView>
      </FlexView>
      {!isShowBottomSheet && (
        <SearchButton
          icon="refresh"
          name="여기에서 재검색"
          isFetching={fetchingOilStations || fetchingParkingLots}
          onPress={onResearchOilStation}
        />
      )}
      <MyLocationButton onPress={goMyLocation} />
      <BottomSheet showBottomSheet={!!marker}>
        {onScrollTo =>
          marker && <SelectMarkerCard marker={marker} onScrollTo={onScrollTo} />
        }
      </BottomSheet>
    </>
  );
}

export default GoogleMap;
