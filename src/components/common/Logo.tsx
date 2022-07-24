import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import SVG from '@/assets/SVG';
import {palette} from '@/constant';

export default function Logo() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.left}>
        <SVG name="car-logo" width={40} height={30} />
        <Text style={styles.leftText}>PARKING</Text>
      </View>
      <Text style={styles.rightText}>PPAK</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    alignItems: 'center',
  },
  leftText: {fontSize: 12, marginTop: -10},
  rightText: {
    fontSize: 32,
    fontWeight: '600',
    color: palette.blue_2,
    marginLeft: 5,
  },
});
