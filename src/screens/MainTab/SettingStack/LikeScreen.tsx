import * as React from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {palette} from '@/constant';
import {useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import useLike from '@/recoil/actions/useLike';
import ParkingLotCard from '@/components/Setting/ParkingLotCard';
import GasStationCard from '@/components/Setting/GasStationCard';
import {TabView, TabBar, SceneRendererProps} from 'react-native-tab-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RouteType = {
  key: ContentType;
  title: string;
};

const ParkingRoute = ({navigation}: NativeStackScreenProps<any>) => {
  const {getMyParkingLotList, removeLike, addLike} = useLike();
  const queryClient = useQueryClient();

  const {data: parkingData, isLoading} = useQuery(
    ['like-list', 'parking-lot'],
    getMyParkingLotList,
  );

  const addLikeMutation = useMutation({
    mutationFn: addLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'parking-lot']);
    },
  });

  const removeLikeMutation = useMutation({
    mutationFn: removeLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'parking-lot']);
    },
  });

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLikeMutation.mutate({dataId: id, type: 'PARKING_LOT'});
    } else {
      removeLikeMutation.mutate({dataId: id, type: 'PARKING_LOT'});
    }
  };

  const onNavigate = (lat: number, lng: number) => {
    console.log(lat, lng);
  };

  const onClickItem = (id: number) => {
    navigation.navigate('DetailPage', {state: {type: 'PARKING_LOT', id}});
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return parkingData?.data.length ? (
    <FlatList<ParkingLot>
      data={parkingData.data}
      renderItem={({item}) => (
        <ParkingLotCard
          info={item}
          onClickItem={onClickItem}
          onToggle={onToggle}
          onNavigate={onNavigate}
        />
      )}
      keyExtractor={item => item.parkingName}
    />
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.empty}>찜한 주차장이 없습니다.</Text>
    </View>
  );
};

const OilRoute = ({navigation}: NativeStackScreenProps<any>) => {
  const {getMyGasStationList, addLike, removeLike} = useLike();

  const queryClient = useQueryClient();

  const {data: gasStationData, isLoading} = useQuery(
    ['like-list', 'gas-station'],
    getMyGasStationList,
  );

  const addLikeMutation = useMutation({
    mutationFn: addLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'gas-station']);
    },
  });

  const removeLikeMutation = useMutation({
    mutationFn: removeLike,
    onSuccess: () => {
      queryClient.invalidateQueries(['like-list', 'gas-station']);
    },
  });

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLikeMutation.mutate({dataId: id, type: 'GAS_STATION'});
    } else {
      removeLikeMutation.mutate({dataId: id, type: 'GAS_STATION'});
    }
  };

  const onNavigate = (lat: number, lng: number) => {
    console.log(lat, lng);
  };

  const onClickItem = (id: number) => {
    navigation.navigate('DetailPage', {state: {type: 'GAS_STATION', id}});
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return gasStationData?.data.length ? (
    <FlatList<GasStation>
      data={gasStationData.data}
      renderItem={({item}) => (
        <GasStationCard
          info={item}
          onClickItem={onClickItem}
          onNavigate={onNavigate}
          onToggle={onToggle}
        />
      )}
      keyExtractor={item => item.name}
    />
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.empty}>찜한 주유소가 없습니다.</Text>
    </View>
  );
};

const routes: RouteType[] = [
  {key: 'GAS_STATION', title: '주유소'},
  {key: 'PARKING_LOT', title: '주차장'},
];

export default function LikeScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState<number>();

  const renderScene = ({
    route: sceneRoute,
  }: SceneRendererProps & {
    route: RouteType;
  }) => {
    switch (sceneRoute.key) {
      case 'PARKING_LOT':
        return <ParkingRoute navigation={navigation} route={route} />;
      case 'GAS_STATION':
        return <OilRoute navigation={navigation} route={route} />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (route.params?.type === 'GAS_STATION') {
      setIndex(0);
    } else {
      setIndex(1);
    }
  }, [route]);

  if (index === undefined) {
    return <ActivityIndicator style={styles.loading} />;
  }

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: palette.blue_1}}
          style={{
            backgroundColor: palette.white,
            shadowOffset: {height: 0, width: 0},
            shadowColor: 'transparent',
          }}
          labelStyle={{color: palette.blue_1, fontWeight: 'bold'}}
          pressOpacity={0.7}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  loading: {flex: 1},
  emptyBox: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  empty: {fontSize: 20, color: palette.grey_2},
});
