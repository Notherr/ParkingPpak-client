import React from 'react';
import {StyleSheet, Text, FlatList} from 'react-native';
import {ItemCard} from '@/components/Setting';
import {OilList} from '@/constant';
import {useUserInfo} from 'recoil/actions';
import {FlexView, SizedView} from 'components/common';

import {palette} from '@/constant';
import {useRecoilValue} from 'recoil';
import {LocalAuthState} from '@/recoil/atoms';

export default function OilScreen() {
  const userInfo = useRecoilValue(LocalAuthState);
  const {changeOil} = useUserInfo();

  return (
    <FlexView
      style={styles.container}
      flexDirection="column"
      flexSet={['flex-start', 'center']}>
      <SizedView style={styles.header} width="100%" height={100}>
        <Text style={styles.title}>현재 선택된 오일</Text>
        <Text style={styles.currentOil}>
          {userInfo?.oilType ?? '현재 선택된 오일이 없습니다'}
        </Text>
      </SizedView>
      <SizedView style={styles.oilList} width="100%">
        <Text style={styles.title}>오일 변경하기</Text>
        <FlatList<ItemCard<OilType>>
          data={OilList.filter(oil => userInfo?.oilType !== oil).map(oil => ({
            logo: oil,
            title: oil,
          }))}
          renderItem={({item}) => (
            <ItemCard {...item} onPress={() => changeOil(item.title)} />
          )}
          keyExtractor={item => item.title}
        />
      </SizedView>
    </FlexView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: palette.grey_7},
  header: {
    padding: 30,
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {fontSize: 20, fontWeight: '600', color: palette.grey_1},
  currentOil: {
    fontSize: 16,
    fontWeight: '400',
    color: palette.grey_2,
    marginTop: 10,
  },
  oilList: {
    padding: 30,
    display: 'flex',
    alignContent: 'center',
  },
});
