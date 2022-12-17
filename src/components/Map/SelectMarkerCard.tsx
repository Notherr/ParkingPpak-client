import React, {useEffect, useMemo, useState} from 'react';
import {useRecoilState} from 'recoil';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {palette} from '@/constant';
import {useCalculateBottomSheetHeight, useGetOilStationBrandLogo} from 'hooks';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {isBottomSheetMaxHeightState} from '@/recoil/atoms';
import {SizedView, FlexView, TextComponent, Loading} from 'components/common';
import ParkingLotDetail from '@/screens/Map/ParkingLotDetail';
import GasStationDetail from '@/screens/Map/GasStationDetail';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import useLike from '@/recoil/actions/useLike';
import {useContent} from '@/recoil/actions';

type SelectMarkerCardType = {
  id: number;
  type: ContentType;
  onScrollTo: (yPosition: number) => void;
};

function SelectMarkerCard({id, type, onScrollTo}: SelectMarkerCardType) {
  const contentType = useMemo(
    () => (type === 'GAS_STATION' ? 'gas-station' : 'parking-lot'),
    [],
  );

  const [markerInfo, setMarkerInfo] = useState<{
    id: number;
    title: string;
    logo?: JSX.Element;
    subInfo?: string;
    isFavorite: boolean;
    address: string;
  }>();
  const {removeLike, addLike} = useLike();
  const queryClient = useQueryClient();

  const {DEFAULT_SHOW_SCREEN_HEIGHT} = useCalculateBottomSheetHeight();

  const [isMaxHeight, setIsMaxHeight] = useRecoilState(
    isBottomSheetMaxHeightState,
  );

  const addLikeMutation = useMutation({
    mutationFn: addLike,
    onSuccess: (_, variables) => {
      if (markerInfo) {
        setMarkerInfo({...markerInfo, isFavorite: !markerInfo?.isFavorite});
      }
      queryClient.invalidateQueries(['like-list', contentType]);
      queryClient.invalidateQueries([
        'content-detail',
        contentType,
        variables.dataId,
      ]);
    },
  });
  const {getDetailContent} = useContent();

  const {data} = useQuery(['content-detail', contentType, id], () =>
    getDetailContent(`?type=${contentType.replace('-', '_')}&id=${id}`),
  );

  const removeLikeMutation = useMutation({
    mutationFn: removeLike,
    onSuccess: (_, variables) => {
      if (markerInfo) {
        setMarkerInfo({...markerInfo, isFavorite: !markerInfo?.isFavorite});
      }
      queryClient.invalidateQueries(['like-list', contentType]);
      queryClient.invalidateQueries([
        'content-detail',
        contentType,
        variables.dataId,
      ]);
    },
  });

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLikeMutation.mutate({dataId: id, type});
    } else {
      removeLikeMutation.mutate({dataId: id, type});
    }
  };

  useEffect(() => {
    if (data) {
      if (type === 'GAS_STATION') {
        const gasStationData = data as GasStation;
        const {logo} = useGetOilStationBrandLogo(gasStationData.compName);
        setMarkerInfo({
          id: id,
          title: gasStationData.compName,
          logo,
          subInfo: `휘발유 ${gasStationData?.gasolinePrice?.toLocaleString()}원`,
          isFavorite: gasStationData.isFavorite,
          address: gasStationData.address,
        });
      } else {
        const parkingLotData = data as ParkingLot;
        setMarkerInfo({
          id: parkingLotData.id,
          title: parkingLotData.parkingName,
          subInfo: `${parkingLotData?.rates?.toLocaleString()}원`,
          isFavorite: parkingLotData.isFavorite,
          address: parkingLotData.address,
        });
      }
    }
  }, [data]);

  if (!markerInfo) {
    return <ActivityIndicator />;
  }

  if (isMaxHeight) {
    if (type === 'GAS_STATION') {
      return (
        <GasStationDetail
          id={id}
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
        id={id}
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
              <TextComponent style={{fontSize: 20}}>
                {markerInfo?.title}
              </TextComponent>
            </FlexView>
            <Pressable
              style={({pressed}) => [
                styles.button,
                Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
              ]}
              android_ripple={{color: palette.white}}
              onPress={() => {
                if (markerInfo?.id)
                  onToggle(markerInfo.id, !markerInfo.isFavorite);
              }}>
              <MaterialIcon
                name={
                  markerInfo?.isFavorite ? 'cards-heart' : 'cards-heart-outline'
                }
                color={palette.red_1}
                size={20}
              />
            </Pressable>
          </FlexView>
        </FlexView>
        <FlexView>
          <FlexView
            flexDirection="column"
            marginHorizontal={20}
            flexSet={['flex-start']}
            style={{width: 'auto', height: 'auto'}}>
            <TextComponent style={{fontSize: 16, marginBottom: 8}}>
              {markerInfo?.subInfo}
            </TextComponent>
            <TextComponent style={{fontSize: 16}}>
              {markerInfo?.address}
            </TextComponent>
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
