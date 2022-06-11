import React from 'react';
import SVG from 'assets/SVG';
import Images from 'assets/images';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import {FlexView, BorderView, TextComponent} from 'components/common';

type OilStationMarkerProps = {
  marker: OilStationType;

  onPress: (marker: OilStationType) => void;
  zoom: number;
};

function OilStationMarker({marker, onPress, zoom}: OilStationMarkerProps) {
  const brandName = marker.POLL_DIV_CD;
  const coordinate = {
    longitude: marker.GIS_Y_COOR,
    latitude: marker.GIS_X_COOR,
  };
  const totalOilStationBrandList: Record<OIL_STATIONS, OIL_STATIONS> = {
    SKE: 'SKE',
    HDO: 'HDO',
    SOL: 'SOL',
    FRUGAL: 'FRUGAL',
    GSC: 'GSC',
    RTX: 'RTX',
    NHO: 'NHO',
    RTO: 'RTO',
    ETC: 'ETC',
  };

  const noSvgImageBrandList: Pick<
    typeof totalOilStationBrandList,
    'HDO' | 'FRUGAL' | 'GSC' | 'NHO' | 'RTO' | 'RTX' | 'ETC'
  > = {
    HDO: 'HDO',
    FRUGAL: 'FRUGAL',
    GSC: 'GSC',
    NHO: 'NHO',
    RTO: 'RTO',
    RTX: 'RTX',
    ETC: 'ETC',
  };

  const brand =
    totalOilStationBrandList[
      brandName as keyof typeof totalOilStationBrandList
    ];

  const getBrandLogo = (brand: string) => {
    if (brand === 'SKE' || brand === 'SOL') {
      return (
        <SVG
          name={brand}
          width={30}
          height={30}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      );
    }
    return (
      <Image
        source={Images[brand as keyof typeof noSvgImageBrandList]}
        style={{width: 25, height: 25}}
      />
    );
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

  return (
    <Marker coordinate={coordinate} onPress={() => onPress(marker)}>
      <BorderView
        style={{
          ...getMarkerStyleChangesLevel(zoom),
          backgroundColor: '#fff',
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
        borderColor={'#ddd'}>
        <FlexView
          flexSet={[
            zoom <= 11 ? 'center' : 'space-between',
            'center',
            'center',
          ]}>
          {getBrandLogo(brand)}
          {zoom > 11 && (
            <TextComponent fontSize={16} fontWeight={'bold'}>
              {marker.PRICE.toLocaleString()}
            </TextComponent>
          )}
        </FlexView>
      </BorderView>
    </Marker>
  );
}

export default OilStationMarker;
