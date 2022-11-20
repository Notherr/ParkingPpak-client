import React, {useEffect, useRef} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';
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
import {useGetOilStationBrandLogo} from '@/hooks';
import MapView from 'react-native-maps';
import {CurrentLocationMarker} from '@/components/Map';

type DetailInfo = {
  content: string;
  icon: React.ReactNode;
};

export default function GasStationDetail({
  id,
  goBack,
}: {
  id: number;
  goBack: () => void;
}) {
  const {getDetailContent} = useContent();
  const {isLoading, data} = useQuery(['content', 'GAS_STATION', id], () =>
    getDetailContent(`?type=gas_station&id=${id}`),
  );

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
    if (data) {
      const {lat, lon} = data as GasStation;
      mapRef.current?.animateToRegion(getRegionForZoom(lat, lon, 15));
    }
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  const {
    compName,
    name,
    address,
    lon,
    lat,
    gasolinePrice,
    dieselPrice,
    carWash,
    cvsExist,
    tel,
  } = data as GasStation;

  const {logo} = useGetOilStationBrandLogo(compName);

  const INFO_LIST: DetailInfo[] = [
    {
      content: `가솔린 1L당 ${gasolinePrice}원`,
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
      content: `디젤 1L당 ${dieselPrice}원`,
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
      content: `??`,
      icon: (
        <MaterialIcon
          name="clock-time-four-outline"
          style={styles.infoIcon}
          size={24}
          color={palette.grey_4}
        />
      ),
    },
    {
      content: tel,
      icon: (
        <MaterialCommunityIcons
          name="phone-classic"
          style={styles.infoIcon}
          size={24}
          color={palette.grey_4}
        />
      ),
    },
    {
      content: carWash ? '새차 가능' : '새차 불가',
      icon: (
        <MaterialCommunityIcons
          name="car-wash"
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
            onPress={goBack}>
            <MaterialIcon
              // name={like ? 'cards-heart' : 'cards-heart-outline'}
              name={'cards-heart'}
              color={palette.red_1}
              size={18}
            />
          </Pressable>
        </View>
      </View>
      <View>
        <View style={styles.titleWrapper}>
          {logo}
          <Text style={styles.title}>{name}</Text>
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
                  latitude: lat,
                  longitude: lon,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}>
                <CurrentLocationMarker latitude={lat} longitude={lon} />
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
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 24,
    alignSelf: 'center',
  },
  title: {
    color: palette.grey_1,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
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
