import React, {useMemo} from 'react';
import {palette} from 'constant';
import {Marker} from 'react-native-maps';
import {FlexView, BorderView, TextComponent} from 'components/common';
import {StyleSheet, View} from 'react-native';

type CustomMarkerProps = {
  title: string;
  selected: boolean;
  logo?: JSX.Element;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  onPress: () => void;
  zoom: number;
};

function CustomMarker({
  title,
  logo,
  onPress,
  coordinate,
  zoom,
  selected,
}: CustomMarkerProps) {
  function getMarkerStyleChangesLevel(zoom: number) {
    if (zoom <= 11) {
      return {
        height: 35,
        borderRadius: 50,
      };
    } else {
      return {
        height: 40,
      };
    }
  }

  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <BorderView
        style={{
          ...getMarkerStyleChangesLevel(zoom),
          backgroundColor: selected ? palette.blue_2 : '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        }}
        width={100}
        paddingHorizontal={5}
        borderRadius={4}
        borderColor={selected ? palette.blue_1 : '#ddd'}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}>
          {logo && <View style={{width: 30}}>{logo}</View>}
          {zoom > 11 && (
            <TextComponent
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: selected ? '#fff' : '#000',
              }}>
              {title}
            </TextComponent>
          )}
        </View>
      </BorderView>
    </Marker>
  );
}

export default CustomMarker;
