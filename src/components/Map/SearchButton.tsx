import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

type SearchButtonType = {
  icon: string;
  name: string;
  size?: number;
  isFetching: boolean;
  onPress: () => void;
};

export default function SearchButton({
  icon,
  name,
  size = 20,
  isFetching,
  onPress,
}: SearchButtonType) {
  const {bottom: marginBottom} = useSafeAreaInsets();
  const bottom = marginBottom;

  return (
    <View style={[styles.wrapper, {bottom: bottom + 20}]}>
      {!isFetching ? (
        <Pressable onPress={onPress} style={styles.button}>
          <Icon name={icon} size={size} color={palette.white} />
          <Text style={styles.text}>{name}</Text>
        </Pressable>
      ) : (
        <ActivityIndicator color={palette.white} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.blue_2,
    shadowColor: '#8B8B8B',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 150,
    shadowOpacity: 0.8,
    alignSelf: 'center',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: palette.white,
    fontSize: 14,
    marginLeft: 10,
  },
});
