import React from 'react';
import {useRecoilValue} from 'recoil';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {View} from 'react-native';
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
                  휘발유
                </TextComponent>
                <TextComponent fontSize={24}>
                  {marker?.PRICE.toLocaleString()}원
                </TextComponent>
              </FlexView>
              <CustomButton
                text="0.9km"
                iconName="navigation"
                size="small"
                style={{padding: 20}}
              />
            </FlexView>
          )}
        </FlexView>
        {isMaxHeight && (
          <>
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            <PrimaryInformationComponent marker={marker} />
            <View style={{backgroundColor: palette.grey_7, height: 10}} />
            <LocationInformationComponent />
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
                text="0.9km"
                iconName="navigation"
                size="small"
                style={{padding: 20}}
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
          주요 정보
        </TextComponent>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>
            휘발유 1L당 {marker.PRICE.toLocaleString()}원
          </TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>
            경유 1L당 {marker.PRICE.toLocaleString()}원
          </TextComponent>
        </FlexView>
        <FlexView
          flexSet={['flex-start', 'center']}
          style={{height: 'auto', marginBottom: 20}}>
          <Icons name="local-gas-station" size={20} style={{marginRight: 40}} />
          <TextComponent fontSize={14}>
            등유 1L당 {marker.PRICE.toLocaleString()}원
          </TextComponent>
        </FlexView>
      </FlexView>
    </View>
  );
}

function LocationInformationComponent() {
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
          style={{backgroundColor: '#ddd', marginBottom: 20}}
          borderColor={'#ddd'}
        />
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
