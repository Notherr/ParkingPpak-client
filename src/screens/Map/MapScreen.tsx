import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NaverMap} from 'components/Map';
import {View, Pressable, StyleSheet, StatusBar, Platform} from 'react-native';

function MapScreen({navigation}: NativeStackScreenProps<any>) {
  const {top} = useSafeAreaInsets();
  const goToBackScreen = () => navigation.pop();

  return (
    <View style={{flex: 1}}>
      <StatusBar />
      <View style={[styles.wrapper, {top}]}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: '#fff'}}
          onPress={goToBackScreen}>
          <Icon name="arrow-back-ios" size={24} style={styles.icon} />
        </Pressable>
      </View>
      <NaverMap />
    </View>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  backButton: {
    borderWidth: 2,
    borderColor: 'red',
  },
  wrapper: {
    position: 'absolute',
    left: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#4d4d4d',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: Platform.select({android: 'hidden'}),
    zIndex: 3,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#fff',
  },
});
