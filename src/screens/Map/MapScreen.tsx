import React from 'react';
import {useRecoilValue} from 'recoil';
import {isShowBottomSheet} from '@/recoil/atoms';
import {View, StyleSheet} from 'react-native';
import {SearchBox, Swtich, ListButton, GoogleMap} from 'components/Map';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function MapScreen({navigation, route}: NativeStackScreenProps<any>) {
  const isShowBottomSheetState = useRecoilValue(isShowBottomSheet);

  return (
    <View style={styles.box}>
      <GoogleMap />
      {isShowBottomSheetState && (
        <SearchBox navigation={navigation} route={route} />
      )}
      <Swtich />
      {/* <ListButton navigation={navigation} route={route} /> */}
    </View>
  );
}

export default MapScreen;

const styles = StyleSheet.create({box: {flex: 1}});
