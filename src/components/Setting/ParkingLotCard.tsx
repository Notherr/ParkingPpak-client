import React from 'react';
import {Pressable, StyleSheet, Text, Platform, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {palette} from '@/constant';
import {SizedView, CustomButton} from '@components/common';

type ParkingLotCardProps = {
  info: ParkingLot;
  onNavigate: (lat: number, lng: number) => void;
  onToggle: (id: number) => void;
  like?: boolean;
};

export default function ParkingLotCard({
  like,
  info,
  onNavigate,
  onToggle,
}: ParkingLotCardProps) {
  const {parkingName, id, lat, lng, address, payYN} = info;
  return (
    <SizedView style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>
          {parkingName} {!payYN && '(무료)'}
        </Text>
        <Text style={styles.address}>{address}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={() => onToggle(id)}>
          <MaterialIcon
            name={like ? 'cards-heart' : 'cards-heart-outline'}
            color={palette.red_1}
            size={20}
          />
        </Pressable>
        <CustomButton
          onPress={() => onNavigate(lat, lng)}
          text="경로찾기"
          size="small"
          iconName="navigation-variant-outline"
        />
      </View>
    </SizedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.grey_6,
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  info: {paddingLeft: 20, flex: 1, paddingRight: 10},
  buttonWrapper: {width: 120, marginRight: 20},
  button: {
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  title: {
    color: palette.grey_2,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    color: palette.blue_2,
    fontSize: 18,
    fontWeight: '400',
  },
});
