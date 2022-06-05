import {atom} from 'recoil';

export const isShowBottomSheet = atom<boolean>({
  key: 'isShowBottomSheet',
  default: true,
});

export const isMarkerInfo = atom<OilStationType | null>({
  key: 'isMarkerInfo',
  default: null,
});
