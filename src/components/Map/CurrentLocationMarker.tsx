import React from 'react';
import {Image} from 'react-native';
import {LatLng, Marker} from 'react-native-maps';
import images from 'assets/images';

function CurrentLocationMarker({latitude, longitude}: LatLng) {
  return (
    <Marker coordinate={{latitude, longitude}}>
      <Image
        source={images.MapMarker}
        style={{width: 30, height: 30}}
        resizeMode="cover"
      />
    </Marker>
  );
}

export default CurrentLocationMarker;
