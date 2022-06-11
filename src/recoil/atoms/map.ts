import {atom, selector} from 'recoil';

export const isShowBottomSheetState = atom<boolean>({
  key: 'map/isShowBottomSheetState',
  default: true,
});

export const isMarkerState = atom<OilStationType | null>({
  key: 'map/isMarkerState',
  default: null,
});

export const isClickMarkerState = selector({
  key: 'map/isClickMarkerState',
  get: ({get}) => {
    const showBottomSheet = get(isShowBottomSheetState);
    const markerInfo = get(isMarkerState);

    return showBottomSheet && !markerInfo;
  },
});
