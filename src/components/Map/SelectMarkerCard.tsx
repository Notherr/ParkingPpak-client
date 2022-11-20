import React, {useRef, useEffect, useState} from 'react';
import MapView from 'react-native-maps';
import {useRecoilValue} from 'recoil';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
  Text,
} from 'react-native';
import {palette} from '@/constant';
import {useGetOilStationBrandLogo} from 'hooks';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {useNavigation} from '@react-navigation/native';

type SelectMarkerCardType = {
  marker: GasStationWrapper | ParkingLotWrapper;
};

function SelectMarkerCard({marker}: SelectMarkerCardType) {
  const [markerInfo, setMarkerInfo] = useState<{
    id: number;
    title: string;
    logo?: JSX.Element;
    subInfo?: string;
    isFavorite: boolean;
  }>();

  const isMaxHeight = useRecoilValue(isBottomSheetMaxHeightState);

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

  const navigation = useNavigation();

  // useEffect(() => {
  //   if (isMaxHeight) {
  //     const {type, info} = marker;
  //     // navigation.navigate('Map', {
  //     //   screen: 'DetailPage',
  //     //   params: {state: {type: 'GAS_STATION', id}},
  //     // });
  //     // navigation.navigate('DetailPage', {state: {type, id: info.id}});
  //   }
  // }, [isMaxHeight]);

  if (!markerInfo) {
    return <Loading />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 20,
        position: 'relative',
        backgroundColor: isMaxHeight ? 'red' : 'green',
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
