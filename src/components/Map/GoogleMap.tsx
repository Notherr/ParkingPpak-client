import React, {useRef, useState} from 'react';
import {useQuery} from 'react-query';
import proj4 from 'proj4';
import {StyleSheet, Image, ActivityIndicator} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {
  OilStationMarker,
  CenterMarker,
  SearchButton,
  MyLocationButton,
} from 'components/Map';
import {FlexView} from 'components/common';
import {getAroundAllOilStation} from 'api';
import images from 'assets/images';
import {useGetCurrentPosition} from 'hooks';

//아래 proj4 라이브러리는 google map의 지도 위치 표기 방법은 WGS84방식, 오피넷의 위치 표기방식은 TM128방식이므로, 이를 서로 변경해주는 작업입니다.
const WGS84 = 'WGS84';
const TM128 = 'TM128';

proj4.defs('WGS84', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');
proj4.defs(
  'TM128',
  '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43',
);

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

function GoogleMap() {
  const mapRef = useRef<MapView>(null);
  const {latlng} = useGetCurrentPosition();

  const [region, setRegion] = useState<Region>({
    latitude: 37.564362,
    longitude: 126.977011,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
  });
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

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
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
        <MapView
          ref={mapRef}
          style={styles.map}
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
              key={oilStation.UNI_ID}
              title={oilStation.OS_NM}
              brandName={oilStation.POLL_DIV_CD}
              coordinate={{
                longitude: oilStation.GIS_Y_COOR,
                latitude: oilStation.GIS_X_COOR,
              }}
              price={oilStation.PRICE}
              onPress={() => console.log('임시 클릭')}
            />
          ))}
        </MapView>
      </FlexView>
      <SearchButton
        icon="refresh"
        name="여기에서 재 검색"
        isFetching={isFetching}
        onPress={onResearchOilStation}
      />
      <MyLocationButton onPress={goMyLocation} />
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    position: 'absolute',
    right: 15,
    width: 50,
    top: '25%',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 0.5,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
});

export default GoogleMap;
