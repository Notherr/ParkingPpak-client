import {useCallback, useEffect} from 'react';
import {Dimensions} from 'react-native';
import {useSharedValue, withSpring} from 'react-native-reanimated';

function useScrollBottomSheet(showBottomSheet: boolean) {
  const {height: SCREEN_HEIGHT} = Dimensions.get('window');
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
  const DEFAULT_SHOW_SCREEN_HEIGHT = MAX_TRANSLATE_Y / 4;

  // Y position
  const translateY = useSharedValue(0);

  const scrollTo = (destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, {damping: 50});
  };

  useEffect(() => {
    if (showBottomSheet) {
      scrollTo(DEFAULT_SHOW_SCREEN_HEIGHT);
    } else {
      scrollTo(0);
    }
  }, [showBottomSheet]);

  return {
    MAX_TRANSLATE_Y,
    DEFAULT_SHOW_SCREEN_HEIGHT,
    translateY,
    scrollTo,
    SCREEN_HEIGHT,
  };
}

export default useScrollBottomSheet;
