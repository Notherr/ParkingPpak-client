import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';
import {Pressable, StyleSheet} from 'react-native';

function MapTypeConverter({navigation, route}: NativeStackScreenProps<any>) {
  console.log(route);
  const onChangeType = () => {
    navigation.navigate('ListPage');
  };

  return (
    <Pressable style={[styles.wrapper]} onPress={onChangeType}>
      <Icon name="format-list-bulleted" size={24} color={palette.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.grey_2,
    top: 130,
    right: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
});

export default MapTypeConverter;
