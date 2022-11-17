import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchBox, Switch, MyMap, MapTypeConverter} from 'components/Map';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from 'react-native-svg';

function MyScreen({navigation, route}: NativeStackScreenProps<any>) {
  const [activeType, setActiveType] = useState<ContentType>('PARKING_LOT');
  const [keyword, setKeyword] = useState<string>();

  const toggleSwitch = (type: ContentType) => setActiveType(type);

  return (
    <View style={styles.box}>
      <MyMap activeType={activeType} keyword={keyword} />
      {/* <SearchBox navigation={navigation} route={route} onSearch={setKeyword} />
      <MapTypeConverter navigation={navigation} route={route} />
      <Switch<ContentType>
        options={[
          {label: '주차장', value: 'PARKING_LOT'},
          {label: '주유소', value: 'GAS_STATION'},
        ]}
        value={activeType}
        onToggle={toggleSwitch}
      /> */}
    </View>
  );
}

export default MyScreen;

const styles = StyleSheet.create({box: {flex: 1, backgroundColor: 'green'}});
