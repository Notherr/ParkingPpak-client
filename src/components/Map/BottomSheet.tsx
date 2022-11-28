import React, {ReactNode} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useScrollBottomSheet, useCalculateBottomSheetHeight} from 'hooks';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import {useSetRecoilState, useRecoilState} from 'recoil';
import {
  isShowBottomSheetState,
  selectedInfoState,
  isBottomSheetMaxHeightState,
} from '@/recoil/atoms';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function BottomSheet({
  showBottomSheet,
  children,
}: {
  showBottomSheet: boolean;
  children: (onScrollTo: (yPosition: number) => void) => ReactNode;
}) {
  const {scrollTo, translateY} = useScrollBottomSheet(showBottomSheet);
  const {DEFAULT_SHOW_SCREEN_HEIGHT, MAX_TRANSLATE_Y} =
    useCalculateBottomSheetHeight();

  const setIsShowBottomSheet = useSetRecoilState(isShowBottomSheetState);
  const selectedInfo = useSetRecoilState(selectedInfoState);
  const [isMaxHeight, setIsMaxHeight] = useRecoilState(
    isBottomSheetMaxHeightState,
  );

  const onResizeFinished = (yPosition: number) => {
    if (yPosition < MAX_TRANSLATE_Y + DEFAULT_SHOW_SCREEN_HEIGHT * -1) {
      setIsMaxHeight(true);
      setIsShowBottomSheet(true);
    } else if (
      yPosition < DEFAULT_SHOW_SCREEN_HEIGHT + 20 &&
      yPosition >= MAX_TRANSLATE_Y + DEFAULT_SHOW_SCREEN_HEIGHT * -1
    ) {
      // 작게 보일때
      setIsMaxHeight(false);
      setIsShowBottomSheet(true);
    } else {
      setIsShowBottomSheet(false);
      setIsMaxHeight(false);
      selectedInfo(undefined);
    }
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {translateY: number}
  >({
    onFinish: () => {
      runOnJS(onResizeFinished)(translateY.value);
    },
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
      if (
        translateY.value <
        MAX_TRANSLATE_Y + DEFAULT_SHOW_SCREEN_HEIGHT * -1
      ) {
        // 가장 큰 사이즈로 보여짐
        scrollTo(MAX_TRANSLATE_Y);
      } else if (
        translateY.value < DEFAULT_SHOW_SCREEN_HEIGHT + 20 &&
        translateY.value >= MAX_TRANSLATE_Y + DEFAULT_SHOW_SCREEN_HEIGHT * -1
      ) {
        // 중간 사이즈로 보여짐
        scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
      } else {
        // 아예 안보임
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
        {children(scrollTo)}
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
