import React from 'react';
import {Image} from 'react-native';
import SVG from 'assets/SVG';
import Images from 'assets/images';

function useGetOilStationBrandLogo(brandName: OIL_STATIONS) {
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

  const brand = totalOilStationBrandList[brandName];

  const getBrandLogo = (brand: OIL_STATIONS) => {
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
    return <Image source={Images[brand]} style={{width: 25, height: 25}} />;
  };

  const logo = getBrandLogo(brand);

  return {logo};
}

export default useGetOilStationBrandLogo;
