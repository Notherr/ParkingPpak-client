import React from 'react';
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import {View, StyleSheet} from 'react-native';

function NaverMap() {
  const P0 = {latitude: 37.564362, longitude: 126.977011};
  return (
    <NaverMapView
      style={{width: '100%', height: '100%'}}
      showsMyLocationButton={true}
      center={{...P0, zoom: 16}}
      // onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
      // onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
      // onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
    />
  );
}

export default NaverMap;
