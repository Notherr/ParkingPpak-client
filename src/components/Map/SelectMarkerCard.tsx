import React, {useRef, useEffect} from 'react';
import MapView, {Region} from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {View, StyleSheet, Dimensions} from 'react-native';
import {palette} from '@/constant';
import {useScrollBottomSheet, useGetOilStationBrandLogo} from 'hooks';
import {isBottomSheetMaxHeightState} from '@/recoil/atoms';
import {
  SizedView,
  FlexView,
  TextComponent,
  CustomButton,
  BorderView,
} from 'components/common';
import {CurrentLocationMarker} from 'components/Map';

type SelectMarkerCardType = {
  marker: OilStationType;
};

function SelectMarkerCard({marker}: SelectMarkerCardType) {
  const {logo} = useGetOilStationBrandLogo(marker.POLL_DIV_CD);
  const isMaxHeight = useRecoilValue(isBottomSheetMaxHeightState);
  const {DEFAULT_SHOW_SCREEN_HEIGHT, SCREEN_HEIGHT} = useScrollBottomSheet();
  const height = -DEFAULT_SHOW_SCREEN_HEIGHT;

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 20,
        position: 'relative',
      }}>
      <SizedView
        marginHorizontal={0}
        height={isMaxHeight ? SCREEN_HEIGHT : height - 80}>
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
              {logo}
              <TextComponent fontSize={20} style={{paddingHorizontal: 10}}>
                {marker?.OS_NM}
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
                  ?????????
                </TextComponent>
                <TextComponent fontSize={24}>
                  {marker?.PRICE.toLocaleString()}???
                </TextComponent>
              </FlexView>
              <CustomButton text="?????????" iconName="navigation" size="small" />
            </FlexView>
          )}
        </FlexView>
        {isMaxHeight && (
          <>
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            <PrimaryInformationComponent marker={marker} />
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            <LocationInformationComponent marker={marker} />
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
                text="?????????"
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

function PrimaryInformationComponent({marker}: SelectMarkerCardType) {
  return (
    <View style={{padding: 20}}>
      <FlexView flexDirection="column" style={{height: 'auto'}}>
        <TextComponent
          fontSize={20}
          fontWeight={'bold'}
          color={palette.grey_1}
          style={{marginBottom: 20}}>
          ?????? ??????
        </TextComponent>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>
            ????????? 1L??? {marker.PRICE.toLocaleString()}???
          </TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>?????? 1L??? xxx???</TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>?????? 1L??? xxx???</TextComponent>
        </FlexView>
      </FlexView>
    </View>
  );
}

function LocationInformationComponent({marker}: SelectMarkerCardType) {
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
    mapRef.current?.animateToRegion(
      getRegionForZoom(marker.GIS_X_COOR, marker.GIS_Y_COOR, 15),
    );
  }, []);

  return (
    <View style={{padding: 20}}>
      <FlexView flexDirection="column" style={{height: 'auto'}}>
        <TextComponent
          fontSize={20}
          fontWeight={'bold'}
          color={palette.grey_1}
          style={{marginBottom: 20}}>
          ?????? ??????
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
              latitude: marker.GIS_X_COOR,
              longitude: marker.GIS_Y_COOR,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <CurrentLocationMarker
              latitude={marker.GIS_X_COOR}
              longitude={marker.GIS_Y_COOR}
            />
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
