import React, {
  forwardRef,
  useState,
  useRef,
  Children,
  useMemo,
  useEffect,
  Ref,
  MutableRefObject,
} from 'react';
import MapView, {Region} from 'react-native-maps';
import {StyleSheet, Dimensions} from 'react-native';
import SuperCluster, {PointFeature} from 'supercluster';
import {GeoJsonProperties} from 'geojson';
import {
  markerToGeoJSONFeature,
  calculateBBox,
  returnMapZoom,
  isMarker,
} from 'utils/map';
import {ClusterMarker} from 'components/Map';
import {palette} from '@/constant';
import {useSetRecoilState} from 'recoil';
import {isShowBottomSheetState} from '@/recoil/atoms';

type CustomClusterMapViewType = ClusterMarkerProperties & {
  radius: number;
  maxZoom: number;
  minZoom: number;
  minPoints: number;
  extent: number;
  nodeSize: number;
  children?: JSX.Element;
  otherChildren?: JSX.Element;
  region?: Region;
  initialRegion?: Region;
  superClusterRef: {current: SuperCluster | null};
  clusterColor?: string;
  clusterTextColor?: string;
  tracksViewChanges?: boolean;
  onClusterPress: () => void;
  onRegionChangeComplete: (newRegion: Region, zoom: number) => void;
  onMapPress: () => void;
  [name: string]: any; // 이 부분은 다시 이런식으로 고쳤는데요. 이렇게 안하면, Cluster 라이브러리 쪽에서 children 관련 에러를 계속 뱉더라고요. 아직 이 부분이 익숙치 않아서 시간을 많이 잡아먹어 진도가 안나가서 일단 임시로 이렇게 작성했습니다.
};

function CustomClusterMapView(
  {
    radius = Dimensions.get('window').width * 0.06,
    maxZoom = 20,
    minZoom = 1,
    minPoints = 5,
    extent = 256,
    nodeSize = 64,
    children,
    onClusterPress = () => console.log('click'),
    onRegionChangeComplete = () => console.log('click'),
    onMapPress = () => console.log('click'),
    clusterColor = palette.blue_1,
    clusterTextColor = '#FFFFFF',
    tracksViewChanges = false,
    superClusterRef = {current: null},
    ...restProps
  }: CustomClusterMapViewType,
  ref: Ref<MapView> | MapView,
) {
  const setIsShowBottomSheet = useSetRecoilState(isShowBottomSheetState);
  const [markers, setMarkers] = useState<
    Array<PointFeature<GeoJsonProperties> | null>
  >([]);
  const [otherChildren, setOtherChildren] = useState([]);
  const [superCluster, setSuperCluster] = useState<SuperCluster<
    SuperCluster.AnyProps,
    SuperCluster.AnyProps
  > | null>(null);
  const [currentRegion, setCurrentRegion] = useState(
    restProps.region || restProps.initialRegion,
  );

  const propsChildren = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    const rawData: any = [];
    const otherChildren: any = [];
    propsChildren.forEach((child: any, index: number) => {
      if (isMarker(child)) {
        rawData.push(markerToGeoJSONFeature(child, index));
      } else {
        otherChildren.push(child);
      }
    });

    const superCluster = new SuperCluster({
      radius,
      maxZoom,
      minZoom,
      minPoints,
      extent,
      nodeSize,
    });

    superCluster.load(rawData);
    const bBox = calculateBBox(currentRegion as Region);
    const zoom = returnMapZoom(currentRegion as Region, bBox, minZoom);
    const markers = superCluster.getClusters(bBox, zoom);

    setMarkers(markers);
    setOtherChildren(otherChildren);
    setSuperCluster(superCluster);

    superClusterRef.current = superCluster;
  }, [
    propsChildren,
    currentRegion,
    extent,
    maxZoom,
    minPoints,
    minZoom,
    nodeSize,
    radius,
  ]);

  const _onRegionChangeComplete = (newRegion: Region) => {
    setIsShowBottomSheet(true);
    if (superCluster && currentRegion) {
      const bBox = calculateBBox(currentRegion);
      const zoom = returnMapZoom(newRegion, bBox, minZoom);
      const markers = superCluster.getClusters(bBox, zoom);
      setMarkers(markers);
      setCurrentRegion(newRegion);
      onRegionChangeComplete(newRegion, zoom);
    }
  };
  const mapRef = useRef<MapView | null>(null);

  return (
    <MapView
      {...restProps}
      ref={map => {
        mapRef.current = map;
        if (ref) {
          (ref as MutableRefObject<any>).current = map;
        }
      }}
      onPress={onMapPress}
      style={styles.map}
      onRegionChangeComplete={_onRegionChangeComplete}>
      {markers.map((marker, idx) =>
        marker?.properties?.point_count === 0 ? (
          propsChildren[marker.properties.index]
        ) : (
          <ClusterMarker
            key={`cluster-${idx}`}
            clusterColor={clusterColor}
            point={marker?.geometry}
            properties={marker?.properties}
            clusterTextColor={clusterTextColor}
            tracksViewChanges={tracksViewChanges}
            onPress={onClusterPress}
          />
        ),
      )}

      {otherChildren}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {flex: 1, width: '100%', height: '100%'},
  customMarker: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default forwardRef(CustomClusterMapView);
