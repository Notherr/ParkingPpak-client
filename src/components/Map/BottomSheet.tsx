import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
  useState,
} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {useScrollBottomSheet} from 'hooks';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {useSetRecoilState} from 'recoil';
import {isShowBottomSheetState, isMarkerState} from '@/recoil/atoms';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

function BottomSheet(
  {children}: BottomSheetProps,
  ref: ForwardedRef<BottomSheetRefProps>,
) {
  const {
    scrollTo,
    isActive,
    translateY,
    defaultContext,
    DEFAULT_SHOW_SCREEN_HEIGHT,
    MAX_TRANSLATE_Y,
  } = useScrollBottomSheet();
  const setIsShowBottomSheet = useSetRecoilState(isShowBottomSheetState);
  const setIsMarker = useSetRecoilState(isMarkerState);
  const [isMaxHeight, setIsMaxHeight] = useState(false);

  useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      defaultContext.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + defaultContext.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > MAX_TRANSLATE_Y + 50 && isMaxHeight) {
        scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
        setIsMaxHeight(false);
      } else if (translateY.value < DEFAULT_SHOW_SCREEN_HEIGHT) {
        scrollTo(MAX_TRANSLATE_Y);
        setIsMaxHeight(true);
      } else if (
        translateY.value > DEFAULT_SHOW_SCREEN_HEIGHT &&
        !isMaxHeight
      ) {
        setIsShowBottomSheet(true);
        setIsMarker(null);
        scrollTo(0);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP,
    );
    return {
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    scrollTo(0);
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});

BottomSheet.displayName = 'BottomSheet';

export default forwardRef(BottomSheet);
