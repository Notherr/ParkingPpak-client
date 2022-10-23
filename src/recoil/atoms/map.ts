import {atom, selector} from 'recoil';

// bottomSheet를 보여줄지 말지 boolean
export const isShowBottomSheetState = atom<boolean>({
  key: 'map/isShowBottomSheetState',
  default: false,
});

// bottomSheet의 detail 버전이 보여지고있는지 boolean
export const isBottomSheetExpandedState = atom<boolean>({
  key: 'map/isBottomSheetExpandedState',
  default: false,
});

// 선택된 주유소/주차장의 정보를 담고있음
export const selectedInfoState = atom<
  | {
      type: ContentType;
      info: GasStation | ParkingLot;
    }
  | undefined
>({
  key: 'map/selectedInfo',
  default: undefined,
});

// 마커가 지금 클릭된 상태인지 boolean
export const isClickMarkerState = selector({
  key: 'map/isClickMarkerState',
  get: ({get}) => {
    const showBottomSheet = get(isShowBottomSheetState);
    const markerInfo = get(selectedInfoState);

    return showBottomSheet && !markerInfo;
  },
});

// bottomsheet가 지금 최대 높이인지 boolean
export const isBottomSheetMaxHeightState = atom<boolean>({
  key: 'map/isBottomSheetMaxHeight',
  default: false,
});
