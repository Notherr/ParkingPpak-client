import React, {useCallback, useRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetRefProps} from '@/components/Map/BottomSheet';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
// const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const DEFAULT_SHOW_SCREEN_HEIGHT = -SCREEN_HEIGHT / 4;

export default function SearchScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const goBack = () => {
    navigation.pop();
  };

  const ref = useRef<BottomSheetRefProps>(null);
  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <TouchableOpacity style={styles.button} onPress={onPress} />
        <BottomSheet ref={ref}>
          <View style={{flex: 1, backgroundColor: 'orange'}} />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  box: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    opacity: 0.6,
  },
});
