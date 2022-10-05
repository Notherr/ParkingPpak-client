import React, {ReactNode} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useScrollBottomSheet} from 'hooks';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {useSetRecoilState, useRecoilState} from 'recoil';
import {
  isShowBottomSheetState,
  isMarkerState,
  isBottomSheetMaxHeightState,
  isBottomSheetExpandedState,
} from '@/recoil/atoms';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function BottomSheet({
  showBottomSheet,
  children,
}: {
  showBottomSheet: boolean;
  children: ReactNode;
}) {
  const {scrollTo, translateY, DEFAULT_SHOW_SCREEN_HEIGHT, MAX_TRANSLATE_Y} =
    useScrollBottomSheet(showBottomSheet);

  const setIsShowBottomSheet = useSetRecoilState(isShowBottomSheetState);
  const setIsMarker = useSetRecoilState(isMarkerState);
  const [isMaxHeight, setIsMaxHeight] = useRecoilState(
    isBottomSheetMaxHeightState,
  );
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {translateY: number}
  >({
    onStart: (_, ctx) => {
      ctx.translateY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = Math.max(
        event.translationY + ctx.translateY,
        MAX_TRANSLATE_Y,
      );
    },
    onEnd: () => {
      if (translateY.value > MAX_TRANSLATE_Y + 50 && isMaxHeight) {
        console.log(1);
        scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
        setIsMaxHeight(false);
      } else if (translateY.value < DEFAULT_SHOW_SCREEN_HEIGHT) {
        scrollTo(MAX_TRANSLATE_Y);
        setIsMaxHeight(true);
      } else if (
        translateY.value > DEFAULT_SHOW_SCREEN_HEIGHT &&
        !isMaxHeight
      ) {
        console.log(3);

        setIsShowBottomSheet(false);
        setIsMarker(null);
        scrollTo(0);
      }
    },
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

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 5,
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
