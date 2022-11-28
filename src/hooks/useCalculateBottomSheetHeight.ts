import {Dimensions} from 'react-native';

function useCalculateBottomSheetHeight() {
  const {height: SCREEN_HEIGHT} = Dimensions.get('window');
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
  const DEFAULT_SHOW_SCREEN_HEIGHT = MAX_TRANSLATE_Y / 4;
  return {SCREEN_HEIGHT, MAX_TRANSLATE_Y, DEFAULT_SHOW_SCREEN_HEIGHT};
}

export default useCalculateBottomSheetHeight;
