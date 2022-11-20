import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import GasStationDetail from './GasStationDetail';
import ParkingLotDetail from './ParkingLotDetail';

export default function DetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<
  {params: {state: {id: number; type: ContentType}}},
  'params'
>) {
  const goBack = () => {
    navigation.pop();
  };

  return route.params.state.type === 'GAS_STATION' ? (
    <GasStationDetail id={route.params.state.id} goBack={goBack} />
  ) : (
    <ParkingLotDetail id={route.params.state.id} goBack={goBack} />
  );
}
