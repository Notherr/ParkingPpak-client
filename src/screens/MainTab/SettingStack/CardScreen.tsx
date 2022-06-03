import {FlexView, SizedView} from 'components/common';
import React from 'react';
import {StyleSheet, Text, FlatList} from 'react-native';
import {ItemCard} from '@/components/Setting';
import {CardList} from '@/constant';
import {useUserInfo} from 'recoil/actions';
import {palette} from '@/constant';
import {useRecoilValue} from 'recoil';
import {LocalAuthState} from '@/recoil/atoms';

export default function CardScreen() {
  const userInfo = useRecoilValue(LocalAuthState);
  const {changeCard} = useUserInfo();

  return (
    <FlexView
      style={styles.container}
      flexDirection="column"
      flexSet={['flex-start', 'center']}>
      <SizedView style={styles.header} width="100%" height={100}>
        <Text style={styles.title}>현재 선택된 카드</Text>
        <Text style={styles.currentCard}>
          {userInfo?.card ?? '현재 선택된 카드가 없습니다'}
        </Text>
      </SizedView>
      <SizedView style={styles.cardList} width="100%">
        <Text style={styles.title}>카드 변경하기</Text>
        <FlatList<ItemCard<CardType>>
          data={CardList.filter(card => userInfo?.card !== card).map(card => ({
            logo: card,
            title: card,
          }))}
          renderItem={({item}) => (
            <ItemCard {...item} onPress={() => changeCard(item.title)} />
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
  currentCard: {
    fontSize: 16,
    fontWeight: '400',
    color: palette.grey_2,
    marginTop: 10,
  },
  cardList: {
    padding: 30,
    display: 'flex',
    alignContent: 'center',
  },
});
