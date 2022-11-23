import React, {useEffect, useRef} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useContent} from 'recoil/actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleCard from '@/components/Map/ToggleCard';
import {palette} from '@/constant';
import {BorderView, CustomButton} from '@/components/common';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import MapView from 'react-native-maps';
import {CurrentLocationMarker} from '@/components/Map';
import useLike from '@/recoil/actions/useLike';

type DetailInfo = {
  content: string;
  icon: React.ReactNode;
};

type DetailParkingLot = {
  addRates: number;
  addTimeRates: number;
  address: string;
  holidayBegin: string;
  holidayEnd: string;
  id: number;
  xcoor: number;
  ycoor: number;
  modificationDate: string;
  parkingCode: number;
  parkingName: string;
  payYN: false;
  phoneNumber: string;
  rates: number;
  syncTime: string;
  timeRates: number;
  type: string;
  weekdayBegin: string;
  weekdayEnd: string;
  weekendBegin: string;
  weekendEnd: string;
  isFavorite: boolean;
};

export default function ParkingLotDetail({
  id,
  goBack,
}: {
  id: number;
  goBack: () => void;
}) {
  const {getDetailContent} = useContent();
  const {removeLike, addLike} = useLike();

  const {isLoading, data} = useQuery(
    ['content-detail', 'parking-lot', id],
    () => getDetailContent(`?type=parking_lot&id=${id}`),
  );
  const queryClient = useQueryClient();

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

  const addLikeMutation = useMutation({
    mutationFn: addLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'parking-lot']);
      queryClient.invalidateQueries(['content-detail', 'parking-lot', id]);
    },
  });

  const removeLikeMutation = useMutation({
    mutationFn: removeLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'parking-lot']);
      queryClient.invalidateQueries(['content-detail', 'parking-lot', id]);
    },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      const {xcoor, ycoor} = data as DetailParkingLot;
      mapRef.current?.animateToRegion(getRegionForZoom(xcoor, ycoor, 15));
    }
  }, [data]);

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLikeMutation.mutate({dataId: id, type: 'PARKING_LOT'});
    } else {
      removeLikeMutation.mutate({dataId: id, type: 'PARKING_LOT'});
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const {
    addRates,
    addTimeRates,
    address,
    holidayBegin,
    holidayEnd,
    xcoor,
    ycoor,
    modificationDate,
    parkingCode,
    parkingName,
    payYN,
    phoneNumber,
    rates,
    syncTime,
    timeRates,
    isFavorite,
    type,
    weekdayBegin,
    weekdayEnd,
    weekendBegin,
    weekendEnd,
  } = data as DetailParkingLot;

  const INFO_LIST: DetailInfo[] = [
    ...(payYN
      ? [
          {
            content: `시간당 ${addRates}원`,
            icon: (
              <Icon
                name="attach-money"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
          {
            content: `addTimeRates당 ${addTimeRates}원`,
            icon: (
              <Icon
                name="attach-money"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
        ]
      : [
          {
            content: `addTimeRates당 ${addTimeRates}원`,
            icon: (
              <Icon
                name="attach-money"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
        ]),
    ...(holidayBegin !== '0000' && holidayEnd !== '0000'
      ? [
          {
            content: `휴일 ${holidayBegin} ${holidayEnd}`,
            icon: (
              <Icon
                name="attach-money"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
        ]
      : []),
    ...(weekdayBegin !== '0000' && weekdayEnd !== '0000'
      ? [
          {
            content: `평일 운영시간 : ${weekdayBegin} ~ ${weekdayBegin}`,
            icon: (
              <MaterialIcon
                name="clock-time-four-outline"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
        ]
      : []),
    ...(weekendBegin !== '0000' && weekendEnd !== '0000'
      ? [
          {
            content: `주말 운영시간 : ${weekendBegin} ~ ${weekendEnd}`,
            icon: (
              <MaterialIcon
                name="clock-time-four-outline"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
            ),
          },
        ]
      : []),
    {
      content: type,
      icon: (
        <MaterialCommunityIcons
          name="parking"
          style={styles.infoIcon}
          size={24}
          color={palette.grey_4}
        />
      ),
    },
    {
      content: phoneNumber,
      icon: (
        <MaterialCommunityIcons
          name="phone-classic"
          style={styles.infoIcon}
          size={24}
          color={palette.grey_4}
        />
      ),
    },
  ];

  return (
    <ScrollView
      style={styles.block}
      contentContainerStyle={{paddingBottom: 100}}>
      <View style={[styles.header]}>
        <Pressable
          style={({pressed}) => [
            styles.back,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={goBack}>
          <Icon name="arrow-back" size={24} style={styles.icon} />
        </Pressable>
        <View style={styles.iconWrapper}>
          <Pressable
            style={({pressed}) => [
              styles.headerIcon,
              Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
            ]}
            android_ripple={{color: palette.white}}
            onPress={goBack}>
            <Icon name="edit" size={18} style={styles.icon} />
          </Pressable>
          <Pressable
            style={({pressed}) => [
              styles.headerIcon,
              Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
            ]}
            android_ripple={{color: palette.white}}
            onPress={goBack}>
            <Icon name="share" size={18} style={styles.icon} />
          </Pressable>
          <Pressable
            style={({pressed}) => [
              styles.headerIcon,
              Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
            ]}
            android_ripple={{color: palette.white}}
            onPress={() => {
              onToggle(id, !isFavorite);
            }}>
            <MaterialIcon
              name={isFavorite ? 'cards-heart' : 'cards-heart-outline'}
              color={palette.red_1}
              size={18}
            />
          </Pressable>
        </View>
      </View>
      <View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{parkingName}</Text>
          <Text style={styles.syncDate}>
            데이터 동기화 날짜: {modificationDate.split('T')[0]}
          </Text>
        </View>
        <CustomButton text="길찾기" style={styles.navigateButton} />
        <View style={styles.divideLine} />
        <ToggleCard title="주요 정보" openOnMount>
          {INFO_LIST.map((info, index) => (
            <View key={`${info.content}-${index}`} style={styles.infoItem}>
              {info.icon}
              <Text style={styles.infoText}>{info.content}</Text>
            </View>
          ))}
        </ToggleCard>
        <View style={styles.divideLine} />
        <ToggleCard title="위치 정보" openOnMount>
          <View style={styles.positionWrapper}>
            <Text style={styles.address}>{address}</Text>
            <BorderView
              height={150}
              borderRadius={4}
              style={styles.map}
              borderColor={'#ddd'}>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: xcoor,
                  longitude: ycoor,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <CurrentLocationMarker latitude={xcoor} longitude={ycoor} />
              </MapView>
            </BorderView>
          </View>
        </ToggleCard>
        <View style={styles.divideLine} />
        <ToggleCard title="주변 주차장 리스트" openOnMount></ToggleCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: palette.white},
  header: {
    flexDirection: 'row',
    backgroundColor: palette.white,
    marginTop: 50, // 수정필요
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  iconWrapper: {flexDirection: 'row'},
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: palette.grey_7,
    paddingHorizontal: 10,
    shadowColor: '#8B8B8B',
  },
  back: {
    justifyContent: 'center',
  },
  headerIcon: {
    marginLeft: 16,
  },
  icon: {
    color: palette.grey_3,
  },
  content: {},
  titleWrapper: {
    alignItems: 'center',
    marginVertical: 24,
    alignSelf: 'center',
  },
  title: {
    color: palette.grey_1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  syncDate: {
    color: palette.grey_2,
    fontSize: 14,
    fontWeight: 'normal',
    marginTop: 12,
  },
  divideLine: {
    backgroundColor: palette.grey_7,
    height: 4,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  infoIcon: {marginRight: 40},
  infoText: {fontSize: 14, fontWeight: '400', color: palette.grey_2},
  positionWrapper: {
    padding: 20,
  },
  address: {
    color: palette.grey_3,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 24,
  },
  map: {width: '100%', height: 300, alignSelf: 'center'},
  navigateButton: {
    width: '60%',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
