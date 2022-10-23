import * as React from 'react';
import {useState} from 'react';
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
import {RouteProp} from '@react-navigation/native';
import useLike from '@/recoil/actions/useLike';
import ParkingLotCard from '@/components/Setting/ParkingLotCard';
import GasStationCard from '@/components/Setting/GasStationCard';
import {TabView, TabBar, SceneRendererProps} from 'react-native-tab-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RouteType = {
  key: ContentType;
  title: string;
};

const ParkingRoute = ({navigation, route}: NativeStackScreenProps<any>) => {
  const [parkingLotList, setParkingLotList] = useState<ParkingLot[]>([]);
  const {getMyParkingLotList, removeLike, addLike} = useLike();
  useEffect(() => {
    getMyParkingLotList().then(res => {
      if (res.data) {
        setParkingLotList(res.data);
      }
    });
  }, []);

  const onToggle = (id: number) => {
    removeLike({dataId: id, type: 'PARKING_LOT'}).then(() => {
      // eslint-disable-next-line react/prop-types
      setParkingLotList(props => props.filter(lot => lot.id !== id));
    });
  };

  const onNavigate = (lat: number, lng: number) => {
    console.log(lat, lng);
  };

  const onClickItem = (id: number) => {
    navigation.navigate('DetailPage', {state: {type: 'PARKING_LOT', id}});
  };

  return parkingLotList.length ? (
    <FlatList<ParkingLot>
      data={parkingLotList}
      renderItem={({item}) => (
        <ParkingLotCard
          info={item}
          onClickItem={onClickItem}
          onToggle={onToggle}
          onNavigate={onNavigate}
          like
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

const OilRoute = ({navigation, route}: NativeStackScreenProps<any>) => {
  const [gasStationList, setGasStationList] = useState<GasStation[]>([]);
  const {getMyGasStationList, removeLike} = useLike();

  useEffect(() => {
    getMyGasStationList().then(res => {
      if (res.data) {
        setGasStationList(res.data);
      }
    });
  }, []);

  const onToggle = (id: number) => {
    removeLike({dataId: id, type: 'GAS_STATION'}).then(() => {
      if (gasStationList) {
        // eslint-disable-next-line react/prop-types
        setGasStationList(props => props.filter(gas => gas.id !== id));
      }
    });
  };

  const onNavigate = (lat: number, lng: number) => {
    console.log(lat, lng);
  };

  const onClickItem = (id: number) => {
    navigation.navigate('DetailPage', {state: {type: 'GAS_STATION', id}});
  };

  return gasStationList.length ? (
    <FlatList<GasStation>
      data={gasStationList}
      renderItem={({item}) => (
        <GasStationCard
          info={item}
          onClickItem={onClickItem}
          onNavigate={onNavigate}
          onToggle={onToggle}
          like
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
  {key: 'PARKING_LOT', title: '주차장'},
  {key: 'GAS_STATION', title: '주유소'},
];

type ParamType = RouteProp<{params: {type?: ContentType}}, 'params'>;

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
      setIndex(1);
    } else {
      setIndex(0);
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
