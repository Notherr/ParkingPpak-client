import React from 'react';
import {Image} from 'react-native';
import SVG from 'assets/SVG';
import Images from 'assets/images';

function useGetOilStationBrandLogo(marker: OilStationType) {
  const brandName = marker.POLL_DIV_CD;

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

  const logo = getBrandLogo(brand);

  return {logo};
}

export default useGetOilStationBrandLogo;
