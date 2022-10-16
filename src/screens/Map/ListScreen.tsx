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

  return parkingLotList.length ? (
    <FlatList<ParkingLot>
      data={parkingLotList}
      renderItem={({item}) => (
        <ParkingLotCard
          info={item}
          onToggle={onToggle}
          onNavigate={onNavigate}
          like
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
  const {removeLike} = useLike();

  const {getGasStationList} = useGasStation();

  useEffect(() => {
    getGasStationList(
      `?type=gas_station&lat=${37.5666805}&lon=${126.9784147}`,
    ).then(res => {
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

  return gasStationList.length ? (
    <FlatList<GasStation>
      data={gasStationList}
      renderItem={({item}) => (
        <GasStationCard
          info={item}
          onNavigate={onNavigate}
          onToggle={onToggle}
          like
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

  const goBack = () => {
    navigation.pop();
  };

  const routes: RouteType[] = [
    {key: 'PARKING_LOT', title: '주차장'},
    {key: 'GAS_STATION', title: '주유소'},
  ];

  return (
    <View style={styles.box}>
      <View style={[styles.header]}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={goBack}>
          <Icon name="arrow-back" size={24} style={styles.icon} />
        </Pressable>
        <View style={styles.inputWrapper}>
          <GooglePlacesAutocomplete
            placeholder="장소를 검색하세요"
            autoFillOnNotFound
            fetchDetails
            enablePoweredByContainer={false}
            styles={styles.input}
            onPress={(data, details) => {
              if (details) {
                const {lat, lng} = details.geometry.location;
                // 선택값의 위도, 경도값
                console.log(lat, lng);
              }
            }}
            // key를 환경변수로 관리해야하는데,..ㅜㅠ
            query={{
              key: 'AIzaSyD8bKZW6HCxa8BmvD9BgiQmcE-4VJCPWdM',
              language: 'ko',
              components: 'country:kr',
            }}
            // 현 위치 찾기 기능을 추가할때 사용할 props
            // currentLocation
            // currentLocationLabel="현 위치 찾기"
          />
        </View>
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
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: palette.grey_7,
    paddingHorizontal: 10,
    shadowColor: '#8B8B8B',
    paddingTop: 4, // 인풋 자체의 패딩 바텀이 있는것같아 균형을 맞추기 위해 설정함
  },
  input: {backgroundColor: 'red'},
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
});
