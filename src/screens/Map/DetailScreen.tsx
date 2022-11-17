import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';
import {View, ScrollView, Pressable, StyleSheet, Platform} from 'react-native';
import GasStationDetail from './GasStationDetail';
import ParkingLotDetail from './ParkingLotDetail';

export default function DetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<
  {params: {state: {id: number; type: ContentType}}},
  'params'
>) {
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
      {route.params.state.type === 'GAS_STATION' ? (
        <GasStationDetail id={route.params.state.id} />
      ) : (
        <ParkingLotDetail id={route.params.state.id} />
      )}
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
