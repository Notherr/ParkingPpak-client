import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {View, Pressable, StyleSheet, Platform} from 'react-native';

function SearchBox({navigation}: NativeStackScreenProps<any>) {
  const {top} = useSafeAreaInsets();

  const goToBackScreen = () => navigation.pop();

  return (
    <View style={[styles.wrapper, {top}]}>
      <View style={styles.borderContainer}>
        <GooglePlacesAutocomplete
          placeholder="장소를 검색하세요"
          autoFillOnNotFound
          fetchDetails
          enablePoweredByContainer={false}
          onPress={(data, details) => {
            if (details) {
              const {lat, lng} = details.geometry.location;
              // 선택값의 위도, 경도값
              console.log(lat, lng);
            }
          }}
          renderLeftButton={() => (
            <Pressable
              style={({pressed}) => [
                styles.button,
                Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
              ]}
              android_ripple={{color: palette.white}}
              onPress={goToBackScreen}>
              <Icon name="arrow-back" size={20} style={styles.icon} />
            </Pressable>
          )}
          // key를 환경변수로 관리해야하는데,..ㅜㅠ
          query={{
            key: 'AIzaSyD8bKZW6HCxa8BmvD9BgiQmcE-4VJCPWdM',
            language: 'ko',
            components: 'country:kr',
          }}
          // 현 위치 찾기 기능을 추가할때 사용할 props
          // currentLocation
          // currentLocationLabel="현 위치 찾기"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    zIndex: 3,
  },
  borderContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    shadowColor: '#8B8B8B',
    paddingTop: 4, // 인풋 자체의 패딩 바텀이 있는것같아 균형을 맞추기 위해 설정함
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    elevation: 3,
  },
  button: {
    justifyContent: 'center',
    marginTop: -4,
  },
  icon: {
    color: palette.grey_3,
  },
});

export default SearchBox;
