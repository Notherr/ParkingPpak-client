import {useCallback} from 'react';
import {Dimensions} from 'react-native';
import {useSharedValue, withSpring} from 'react-native-reanimated';

function useScrollBottomSheet() {
  const {height: SCREEN_HEIGHT} = Dimensions.get('window');
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
  const DEFAULT_SHOW_SCREEN_HEIGHT = MAX_TRANSLATE_Y / 4;

  const translateY = useSharedValue(0);
  const defaultContext = useSharedValue({y: 0});
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, {damping: 50});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  return {
    MAX_TRANSLATE_Y,
    DEFAULT_SHOW_SCREEN_HEIGHT,
    translateY,
    scrollTo,
    isActive,
    defaultContext,
    SCREEN_HEIGHT,
  };
}

export default useScrollBottomSheet;
