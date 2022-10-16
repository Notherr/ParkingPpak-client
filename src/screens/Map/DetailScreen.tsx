import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleCard from '@/components/Map/ToggleCard';
import {palette} from '@/constant';
import {CustomButton} from '@/components/common';
import {
  View,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type DetailInfo = {
  type: 'PRICE' | 'TIME' | 'PHONE';
  content: string;
};

const INFO_LIST: DetailInfo[] = [
  {type: 'PRICE', content: '1L당 1,900원'},
  {type: 'TIME', content: '08:00 ~ 24:00'},
  {type: 'PHONE', content: '010-1234-5678'},
];

export default function DetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const layout = useWindowDimensions();
  const {top} = useSafeAreaInsets();
  console.log(layout, top);

  const goBack = () => {
    navigation.pop();
  };

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
      <View style={styles.content}>
        <Text style={styles.title}>GS 칼텍스</Text>
        <CustomButton text="길찾기" style={styles.navigateButton} />
        <View style={styles.divideLine} />
        <ToggleCard title="주요 정보" openOnMount>
          {INFO_LIST.map(info => (
            <View key={info.type} style={styles.infoItem}>
              <MaterialCommunityIcons
                name="clock-time-five-outline"
                style={styles.infoIcon}
                size={24}
                color={palette.grey_4}
              />
              <Text style={styles.infoText}>{info.content}</Text>
            </View>
          ))}
        </ToggleCard>
        <View style={styles.divideLine} />
        <ToggleCard title="위치 정보" openOnMount>
          <View style={styles.positionWrapper}>
            <Text style={styles.address}>서울특별시 동대문구 제기동</Text>
            <View style={styles.map} />
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
  title: {
    color: palette.grey_1,
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: 40,
    paddingBottom: 20,
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
