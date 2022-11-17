import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from 'react-query';
import {useContent} from 'recoil/actions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleCard from '@/components/Map/ToggleCard';
import {palette} from '@/constant';
import {CustomButton} from '@/components/common';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useGetOilStationBrandLogo} from '@/hooks';

type DetailInfo = {
  content: string;
  icon: React.ReactNode;
};

export default function GasStationDetail({id}: {id: number}) {
  const {getDetailContent} = useContent();
  const {isLoading, data} = useQuery(['content', 'GAS_STATION', id], () =>
    getDetailContent(`?type=gas_station&id=${id}`),
  );

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
          <Text>
            {lon} {lat}
          </Text>
          <View style={styles.map} />
        </View>
      </ToggleCard>
      <View style={styles.divideLine} />
      <ToggleCard title="주변 주차장 리스트" openOnMount></ToggleCard>
    </View>
  );
}

const styles = StyleSheet.create({
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
  map: {width: '80%', backgroundColor: 'red', height: 300, alignSelf: 'center'},
  navigateButton: {
    width: '60%',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
