import {useEffect} from 'react';
import useCalculateBottomSheetHeight from './useCalculateBottomSheetHeight';
import {useSharedValue, withSpring} from 'react-native-reanimated';

function useScrollBottomSheet(showBottomSheet: boolean) {
  const {DEFAULT_SHOW_SCREEN_HEIGHT} = useCalculateBottomSheetHeight();

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
    translateY,
    scrollTo,
  };
}

export default useScrollBottomSheet;
