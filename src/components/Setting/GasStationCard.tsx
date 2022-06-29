import React from 'react';
import {Pressable, StyleSheet, Text, Platform, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {palette} from '@/constant';
import {SizedView, CustomButton} from '@components/common';

type GasStationCardProps = {
  title: string;
  like: boolean;
  onPress: () => void;
};

export default function GasStationCard({
  like,
  title,
  onPress,
}: GasStationCardProps) {
  return (
    <SizedView style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.desc}>
          <Text style={styles.perHour}>휘발유</Text>
          <Text style={styles.price}>4,000원</Text>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={onPress}>
          <MaterialIcon
            name={like ? 'cards-heart' : 'cards-heart-outline'}
            color={palette.red_1}
            size={20}
          />
        </Pressable>
        <CustomButton
          onPress={() => undefined}
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
  info: {paddingLeft: 20},
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
  desc: {},
  perHour: {
    color: palette.grey_5,
    fontSize: 14,
    fontWeight: 'normal',
  },
  price: {
    color: palette.blue_2,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
