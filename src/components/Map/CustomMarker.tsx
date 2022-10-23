import React, {useMemo} from 'react';
import {palette} from 'constant';
import {Marker} from 'react-native-maps';
import {FlexView, BorderView, TextComponent} from 'components/common';

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
        width: 35,
        height: 35,
        borderRadius: 50,
      };
    } else {
      return {
        width: 90,
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
        paddingHorizontal={5}
        borderRadius={4}
        borderColor={selected ? palette.blue_1 : '#ddd'}>
        <FlexView
          flexSet={[
            zoom <= 11 ? 'center' : 'space-between',
            'center',
            'center',
          ]}>
          {logo}
          {zoom > 11 && (
            <TextComponent
              fontSize={16}
              fontWeight={'bold'}
              color={selected ? '#fff' : '#000'}>
              {title}
            </TextComponent>
          )}
        </FlexView>
      </BorderView>
    </Marker>
  );
}

export default CustomMarker;
