import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function MapStack() {
  return (
    <View style={styles.block}>
      <Text>MapStack</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {flex: 1, backgroundColor: 'skyblue'},
});