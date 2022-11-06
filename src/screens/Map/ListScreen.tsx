import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useGasStation} from 'recoil/actions';
import {palette} from '@/constant';
import {TabView, TabBar, SceneRendererProps} from 'react-native-tab-view';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import GasStationCard from '@/components/Setting/GasStationCard';
import useLike from '@/recoil/actions/useLike';
import ParkingLotCard from '@/components/Setting/ParkingLotCard';

type RouteType = {
  key: ContentType;
  title: string;
};

const ParkingRoute = ({navigation, route}: NativeStackScreenProps<any>) => {
  const [parkingLotList, setParkingLotList] = useState<ParkingLot[]>([]);
  const {removeLike, addLike} = useLike();

  const {getMapList} = useGasStation();

  useEffect(() => {
    getMapList(`?type=parking_lot&lat=${37.5666805}&lon=${126.9784147}`).then(
      res => {
        if (res.data) {
          setParkingLotList(res.data);
        }
      },
    );
  }, []);

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLike({dataId: id, type: 'PARKING_LOT'}).then(() => {
        setParkingLotList(props =>
          props.map(lot => {
            if (lot.id === id) {
              return {...lot, like: true};
            }
            return lot;
          }),
        );
      });
    } else {
      removeLike({dataId: id, type: 'PARKING_LOT'}).then(() => {
        setParkingLotList(props =>
          props.map(lot => {
            if (lot.id === id) {
              return {...lot, like: false};
            }
            return lot;
          }),
        );
      });
    }
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
        />
      )}
      keyExtractor={item => item.parkingName}
    />
  ) : (
    <View style={styles.emptyBox}>
      <Text style={styles.empty}>주차장이 없습니다.</Text>
    </View>
  );
};

const OilRoute = ({navigation, route}: NativeStackScreenProps<any>) => {
  const [gasStationList, setGasStationList] = useState<GasStation[]>([]);
  const {removeLike, addLike} = useLike();

  const {getMapList} = useGasStation();

  useEffect(() => {
    getMapList(`?type=gas_station&lat=${37.5666805}&lon=${126.9784147}`).then(
      res => {
        if (res.data) {
          setGasStationList(res.data);
        }
      },
    );
  }, []);

  const onToggle = (id: number, like: boolean) => {
    if (like) {
      addLike({dataId: id, type: 'GAS_STATION'}).then(() => {
        setGasStationList(props =>
          props.map(gas => {
            if (gas.id === id) {
              return {...gas, like: true};
            }
            return gas;
          }),
        );
      });
    } else {
      removeLike({dataId: id, type: 'GAS_STATION'}).then(() => {
        setGasStationList(props =>
          props.map(gas => {
            if (gas.id === id) {
              return {...gas, like: false};
            }
            return gas;
          }),
        );
      });
    }
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
        />
      )}
      keyExtractor={item => item.name}
    />
  ) : (
    <View style={styles.emptyBox}>
      <Pressable
        onPress={() => navigation.navigate('DetailPage', {id: 1, type: 'wwn'})}>
        <Text>디테일 보기</Text>
      </Pressable>
      <Text style={styles.empty}>주유소가 없습니다.</Text>
    </View>
  );
};

export default function ListScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
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

  const [index, setIndex] = React.useState<number>(1);
  const layout = useWindowDimensions();
  const [input, setInput] = useState<string>();

  const goBack = () => {
    navigation.pop();
  };

  const routes: RouteType[] = [
    {key: 'PARKING_LOT', title: '주차장'},
    {key: 'GAS_STATION', title: '주유소'},
  ];

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={goBack}>
          <Icon name="arrow-back" size={24} style={styles.icon} />
        </Pressable>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="장소를 검색하세요"
        />
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}>
          <Icon
            name="search"
            size={24}
            style={styles.search}
            color={palette.grey_2}
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        {index === undefined ? (
          <ActivityIndicator style={styles.loading} />
        ) : (
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
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {flex: 1, backgroundColor: palette.white},
  header: {
    flexDirection: 'row',
    backgroundColor: palette.white,
    marginTop: 50, // 수정필요
    paddingHorizontal: 20,
  },
  input: {marginVertical: 6, padding: 10, flex: 1},
  content: {flex: 1},
  loading: {flex: 1},
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.grey_7,
  },
  empty: {fontSize: 20, color: palette.grey_2},
  button: {
    justifyContent: 'center',
    marginTop: -4,
  },
  icon: {
    color: palette.grey_3,
  },
  search: {},
});
