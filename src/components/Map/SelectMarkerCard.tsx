import React, {useEffect, useState} from 'react';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {View, StyleSheet, Pressable, Platform} from 'react-native';
import {palette} from '@/constant';
import {useCalculateBottomSheetHeight, useGetOilStationBrandLogo} from 'hooks';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  isBottomSheetMaxHeightState,
  isShowBottomSheetState,
} from '@/recoil/atoms';
import {SizedView, FlexView, TextComponent, Loading} from 'components/common';
import ParkingLotDetail from '@/screens/Map/ParkingLotDetail';
import GasStationDetail from '@/screens/Map/GasStationDetail';

type SelectMarkerCardType = {
  marker: GasStationWrapper | ParkingLotWrapper;
  onScrollTo: (yPosition: number) => void;
};

function SelectMarkerCard({marker, onScrollTo}: SelectMarkerCardType) {
  const [markerInfo, setMarkerInfo] = useState<{
    id: number;
    title: string;
    logo?: JSX.Element;
    subInfo?: string;
    isFavorite: boolean;
  }>();

  const {DEFAULT_SHOW_SCREEN_HEIGHT} = useCalculateBottomSheetHeight();

  const [isMaxHeight, setIsMaxHeight] = useRecoilState(
    isBottomSheetMaxHeightState,
  );

  useEffect(() => {
    const {type, info} = marker;
    if (type === 'GAS_STATION') {
      const {logo} = useGetOilStationBrandLogo(info.compName);
      setMarkerInfo({
        id: info.id,
        title: info.compName,
        logo,
        subInfo: `휘발유 ${info?.gasolinePrice.toLocaleString()}원`,
        isFavorite: info.isFavorite,
      });
    } else {
      setMarkerInfo({
        id: info.id,
        title: info.parkingName,
        subInfo: `${info?.rates.toLocaleString()}원`,
        isFavorite: info.isFavorite,
      });
    }
  }, [marker]);

  if (!markerInfo) {
    return <Loading />;
  }

  if (isMaxHeight) {
    if (marker.type === 'GAS_STATION') {
      return (
        <GasStationDetail
          id={markerInfo.id}
          goBack={() => {
            onScrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
            setTimeout(() => {
              setIsMaxHeight(false);
            }, 300);
          }}
        />
      );
    }
    return (
      <ParkingLotDetail
        id={markerInfo.id}
        goBack={() => {
          onScrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
          setTimeout(() => {
            setIsMaxHeight(false);
          }, 300);
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 20,
        position: 'relative',
      }}>
      <SizedView marginHorizontal={0}>
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
              {markerInfo?.logo && (
                <View style={{paddingRight: 10}}>{markerInfo.logo}</View>
              )}
              <TextComponent fontSize={20}>{markerInfo.title}</TextComponent>
            </FlexView>
            {!isMaxHeight && (
              <Pressable
                style={({pressed}) => [
                  styles.button,
                  Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
                ]}
                android_ripple={{color: palette.white}}
                // onPress={() => onToggle(id, !like)}
              >
                <MaterialIcon
                  name={
                    markerInfo.isFavorite
                      ? 'cards-heart'
                      : 'cards-heart-outline'
                  }
                  color={palette.red_1}
                  size={20}
                />
              </Pressable>
            )}
          </FlexView>
        </FlexView>
      </SizedView>
    </View>
  );
}

export default SelectMarkerCard;

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
});
