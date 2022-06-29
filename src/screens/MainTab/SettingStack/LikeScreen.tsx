import * as React from 'react';
import {useWindowDimensions} from 'react-native';
import {palette} from '@/constant';
import ParkingLotCard from '@/components/Setting/ParkingLotCard';
import GasStationCard from '@/components/Setting/GasStationCard';
import {TabView, TabBar, SceneRendererProps} from 'react-native-tab-view';
import {FlatList} from 'react-native-gesture-handler';

type RouteType = {
  key: ContentType;
  title: string;
};

const dataList = [
  {title: 'mock data1', like: true, onPress: () => undefined},
  {title: 'mock data2', like: false, onPress: () => undefined},
  {title: 'mock data3', like: true, onPress: () => undefined},
  {title: 'mock data4', like: false, onPress: () => undefined},
  {title: 'mock data5', like: true, onPress: () => undefined},
  {title: 'mock data6', like: false, onPress: () => undefined},
  {title: 'mock data7', like: true, onPress: () => undefined},
  {title: 'mock data8', like: false, onPress: () => undefined},
  {title: 'mock data9', like: true, onPress: () => undefined},
  {title: 'mock data10', like: false, onPress: () => undefined},
  {title: 'mock data11', like: true, onPress: () => undefined},
  {title: 'mock data12', like: false, onPress: () => undefined},
  {title: 'mock data13', like: true, onPress: () => undefined},
];

const ParkingRoute = () => (
  <FlatList<{title: string; like: boolean}>
    data={dataList}
    renderItem={({item}) => (
      <ParkingLotCard {...item} onPress={() => undefined} />
    )}
    keyExtractor={item => item.title}
  />
);

const OilRoute = () => (
  <FlatList<{title: string; like: boolean}>
    data={dataList}
    renderItem={({item}) => (
      <GasStationCard {...item} onPress={() => undefined} />
    )}
    keyExtractor={item => item.title}
  />
);

const renderScene = ({
  route,
}: SceneRendererProps & {
  route: RouteType;
}) => {
  switch (route.key) {
    case 'PARKING_LOT':
      return <ParkingRoute />;
    case 'GAS_STATION':
      return <OilRoute />;
    default:
      return <></>;
  }
};

const routes: RouteType[] = [
  {key: 'PARKING_LOT', title: '주차장'},
  {key: 'GAS_STATION', title: '주유소'},
];

export default function TabViewExample() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState<number>(0);

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
