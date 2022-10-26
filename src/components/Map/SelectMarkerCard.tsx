import React, {useRef, useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Dimensions} from 'react-native';
import {palette} from '@/constant';
import {useGetOilStationBrandLogo} from 'hooks';
import {isBottomSheetMaxHeightState} from '@/recoil/atoms';
import {
  SizedView,
  FlexView,
  TextComponent,
  CustomButton,
  BorderView,
  Loading,
} from 'components/common';
import {CurrentLocationMarker} from 'components/Map';

type SelectMarkerCardType = {
  marker: GasStationWrapper | ParkingLotWrapper;
};

function SelectMarkerCard({marker}: SelectMarkerCardType) {
  const [markerInfo, setMarkerInfo] = useState<{
    title: string;
    logo?: JSX.Element;
    subInfo?: string;
  }>();

  const isMaxHeight = useRecoilValue(isBottomSheetMaxHeightState);

  useEffect(() => {
    const {type, info} = marker;
    if (type === 'GAS_STATION') {
      const {logo} = useGetOilStationBrandLogo(info.compName);
      setMarkerInfo({
        title: info.compName,
        logo,
        subInfo: `${info?.gasolinePrice.toLocaleString()}원`,
      });
    } else {
      setMarkerInfo({
        title: info.parkingName,
        subInfo: `${info?.rates.toLocaleString()}원`,
      });
    }
  }, [marker]);

  if (!markerInfo) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 20,
        position: 'relative',
      }}>
      <SizedView
        marginHorizontal={0}
        // height={isMaxHeight ? SCREEN_HEIGHT : height - 80}
      >
        <FlexView
          flexDirection="column"
          style={{height: 'auto'}}
          paddingHorizontal={20}>
          <FlexView
            flexSet={
              isMaxHeight ? ['center', 'center', 'center'] : ['space-between']
            }
            style={{height: isMaxHeight ? 100 : 'auto'}}
            marginVertical={10}>
            <FlexView
              flexSet={['center']}
              style={{width: 'auto', height: 'auto'}}>
              {markerInfo?.logo}
              <TextComponent fontSize={20} style={{paddingHorizontal: 10}}>
                {markerInfo.title}
              </TextComponent>
            </FlexView>
            {!isMaxHeight && <Icons name="star" size={24} />}
          </FlexView>
          {!isMaxHeight && (
            <FlexView
              flexSet={['space-between', 'center']}
              style={{height: 'auto'}}>
              <FlexView flexDirection="column" style={{width: 'auto'}}>
                <TextComponent fontSize={14} style={{marginVertical: 5}}>
                  휘발유
                </TextComponent>
                <TextComponent fontSize={24}>
                  {markerInfo.subInfo}
                </TextComponent>
              </FlexView>
              <CustomButton
                text="길찾기"
                iconName="navigation"
                size="small"
                style={{paddingHorizontal: 16}}
              />
            </FlexView>
          )}
        </FlexView>
        {isMaxHeight && (
          <>
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            {/* <PrimaryInformationComponent marker={marker.info} /> */}
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            {/* <LocationInformationComponent marker={marker.info} /> */}
            <FlexView
              style={{
                position: 'absolute',
                bottom: 80,
                height: 60,
              }}
              flexSet={['space-between', 'center', 'center']}
              paddingHorizontal={20}>
              <Icons name="star" size={24} />
              <CustomButton
                text="길찾기"
                iconName="navigation"
                size="small"
                style={{paddingHorizontal: 20, fontSize: 20}}
              />
            </FlexView>
          </>
        )}
      </SizedView>
    </View>
  );
}

export default SelectMarkerCard;

function PrimaryInformationComponent(info: GasStation) {
  return (
    <View style={{padding: 20}}>
      <FlexView flexDirection="column" style={{height: 'auto'}}>
        <TextComponent
          fontSize={20}
          fontWeight={'bold'}
          color={palette.grey_1}
          style={{marginBottom: 20}}>
          주요 정보
        </TextComponent>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>
            휘발유 1L당 {info.gasolinePrice.toLocaleString()}원
          </TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>경유 1L당 xxx원</TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>등유 1L당 xxx원</TextComponent>
        </FlexView>
      </FlexView>
    </View>
  );
}

function LocationInformationComponent(info: ParkingLot) {
  const mapRef = useRef<MapView | null>(null);

  const getRegionForZoom = (lat: number, lon: number, zoom: number) => {
    const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
    const {width, height} = Dimensions.get('window');
    const aspectRatio = width / height;
    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta: distanceDelta * aspectRatio,
      longitudeDelta: distanceDelta,
    };
  };

  useEffect(() => {
    mapRef.current?.animateToRegion(getRegionForZoom(info.lat, info.lon, 15));
  }, []);

  return (
    <View style={{padding: 20}}>
      <FlexView flexDirection="column" style={{height: 'auto'}}>
        <TextComponent
          fontSize={20}
          fontWeight={'bold'}
          color={palette.grey_1}
          style={{marginBottom: 20}}>
          위치 정보
        </TextComponent>
        <BorderView
          height={150}
          borderRadius={4}
          style={{marginBottom: 20}}
          borderColor={'#ddd'}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: info.lat,
              longitude: info.lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <CurrentLocationMarker latitude={info.lat} longitude={info.lon} />
          </MapView>
        </BorderView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="access-time" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>XX:XX ~ XX:XX</TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-phone" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>02-XXXX-XXXX</TextComponent>
        </FlexView>
      </FlexView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
