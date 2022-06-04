import React from 'react';
import {Pressable, StyleSheet, Text, Platform} from 'react-native';
import {palette} from '@/constant';
import {SizedView} from '@components/common';

type ItemCardProps<T> = ItemCard<T> & {
  onPress: () => void;
};

export default function ItemCard<T>({logo, title, onPress}: ItemCardProps<T>) {
  return (
    <SizedView height={50} style={styles.container}>
      <Pressable
        style={({pressed}) => [
          styles.button,
          Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
        ]}
        android_ripple={{color: '#fff'}}
        onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
    </SizedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    flex: 1,
    display: 'flex',
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: palette.blue_4,
  },
  title: {
    color: palette.white,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 50,
  },
});
