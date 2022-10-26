import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchBox, Switch, GoogleMap, MapTypeConverter} from 'components/Map';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function MapScreen({navigation, route}: NativeStackScreenProps<any>) {
  const [activeType, setActiveType] = useState<ContentType>('PARKING_LOT');
  const toggleSwitch = (type: ContentType) => setActiveType(type);

  return (
    <View style={styles.box}>
      <GoogleMap activeType={activeType} />
      <SearchBox navigation={navigation} route={route} />
      <MapTypeConverter navigation={navigation} route={route} />
      <Switch<ContentType>
        options={[
          {label: '주차장', value: 'PARKING_LOT'},
          {label: '주유소', value: 'GAS_STATION'},
        ]}
        value={activeType}
        onToggle={toggleSwitch}
      />
    </View>
  );
}

export default MapScreen;

const styles = StyleSheet.create({box: {flex: 1}});
