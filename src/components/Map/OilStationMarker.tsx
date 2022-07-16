import React from 'react';
import {palette} from 'constant';
import {Marker} from 'react-native-maps';
import {useGetOilStationBrandLogo} from 'hooks';
import {FlexView, BorderView, TextComponent} from 'components/common';

type OilStationMarkerProps = {
  marker: OilStationType;
  selectMarker: OilStationType | null;
  onPress: (marker: OilStationType) => void;
  zoom: number;
};

function OilStationMarker({
  marker,
  onPress,
  zoom,
  selectMarker,
}: OilStationMarkerProps) {
  const {logo} = useGetOilStationBrandLogo(marker);
  const coordinate = {
    longitude: marker.GIS_Y_COOR,
    latitude: marker.GIS_X_COOR,
  };

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

  const isSelect = marker.UNI_ID === selectMarker?.UNI_ID;

  return (
    <Marker coordinate={coordinate} onPress={() => onPress(marker)}>
      <BorderView
        style={{
          ...getMarkerStyleChangesLevel(zoom),
          backgroundColor: isSelect ? palette.blue_2 : '#fff',
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
        borderColor={isSelect ? palette.blue_1 : '#ddd'}>
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
              color={isSelect ? '#fff' : '#000'}>
              {marker.PRICE.toLocaleString()}
            </TextComponent>
          )}
        </FlexView>
      </BorderView>
    </Marker>
  );
}

export default OilStationMarker;
