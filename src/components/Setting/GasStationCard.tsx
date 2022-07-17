import React from 'react';
import useGetOilStationBrandLogo from '@/hooks/useGetOilStationBrandLogo';
import {Pressable, StyleSheet, Text, Platform, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {palette} from '@/constant';
import {SizedView, CustomButton} from '@components/common';

type GasStationCardProps = {
  info: GasStation;
  like?: boolean;
  onNavigate: (lat: number, lng: number) => void;
  onToggle: (id: number) => void;
};

export default function GasStationCard({
  info,
  like = false,
  onNavigate,
  onToggle,
}: GasStationCardProps) {
  const {id, name, compName, dieselPrice, gasolinePrice, lat, lng} = info;
  const {logo} = useGetOilStationBrandLogo(compName);
  return (
    <SizedView style={styles.container}>
      <View style={styles.info}>
        <View style={styles.titleWrapper}>
          {logo}
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.desc}>
          <Text style={styles.perHour}>가솔린</Text>
          <Text style={styles.price}>{gasolinePrice.toLocaleString()}원</Text>
        </View>
        <View style={styles.desc}>
          <Text style={styles.perHour}>디젤&nbsp;&nbsp;&nbsp;</Text>
          <Text style={styles.price}>{dieselPrice.toLocaleString()}원</Text>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={() => onToggle(id)}>
          <MaterialIcon
            name={like ? 'cards-heart' : 'cards-heart-outline'}
            color={palette.red_1}
            size={20}
          />
        </Pressable>
        <CustomButton
          onPress={() => onNavigate(lat, lng)}
          text="경로찾기"
          size="small"
          iconName="navigation-variant-outline"
        />
      </View>
    </SizedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.grey_6,
    backgroundColor: palette.white,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  info: {paddingLeft: 20, flex: 1, paddingRight: 10},
  buttonWrapper: {width: 120, marginRight: 20},
  button: {
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  title: {
    color: palette.grey_2,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  desc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  perHour: {
    color: palette.grey_5,
    fontSize: 14,
    fontWeight: 'normal',
    marginRight: 10,
  },
  price: {
    color: palette.blue_2,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
