import React from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import {useLocalAuthActions} from 'recoil/actions';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlexView, SizedView} from 'components/common';
import {useLocalUser} from 'hooks';
import {palette} from '@/constant';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function MyProfileScreen({navigation}: NativeStackScreenProps<any>) {
  const {logout} = useLocalAuthActions();
  const userInfo = useLocalUser();
  const onLogout = () => logout();

  return (
    <FlexView style={styles.container}>
      <FlexView flexDirection="column" flexSet={['flex-start', 'center']}>
        <SizedView style={styles.header} width="100%" height={200}>
          <View>
            <Text style={styles.hello}>안녕하세요!</Text>
            <Text style={styles.name}>{userInfo?.name} 님</Text>
          </View>
          <Pressable>
            <Text style={styles.mypage}>마이페이지</Text>
          </Pressable>
        </SizedView>
        <SizedView style={styles.mainButtonWrapper} width="100%" height={170}>
          <Pressable
            style={styles.mainButton}
            onPress={() => navigation.navigate('Like')}>
            <MaterialIcon
              name="store-outline"
              color={palette.blue_1}
              style={styles.mainButtonIcon}
              size={30}
            />
            <Text style={styles.mainButtonText}>찜 목록</Text>
          </Pressable>
          <Pressable
            style={styles.mainButton}
            onPress={() => navigation.navigate('Nav')}>
            <MaterialIcon
              name="navigation-variant-outline"
              color={palette.blue_1}
              style={styles.mainButtonIcon}
              size={30}
            />
            <Text style={styles.mainButtonText}>네비게이션</Text>
          </Pressable>
          <Pressable
            style={styles.mainButton}
            onPress={() => navigation.navigate('Oil')}>
            <MaterialIcon
              name="gas-station"
              color={palette.blue_1}
              style={styles.mainButtonIcon}
              size={30}
            />
            <Text style={styles.mainButtonText}>나의 연료</Text>
          </Pressable>
          <Pressable
            style={styles.mainButton}
            onPress={() => navigation.navigate('Card')}>
            <MaterialIcon
              name="credit-card-outline"
              color={palette.blue_1}
              style={styles.mainButtonIcon}
              size={30}
            />
            <Text style={styles.mainButtonText}>카드정보</Text>
          </Pressable>
        </SizedView>
        <SizedView style={styles.mainButtonWrapper} width="100%" height={220}>
          <Pressable style={styles.subButton}>
            <Text style={styles.subButtonText}>자주 묻는 질문</Text>
          </Pressable>
          <Pressable style={styles.subButton}>
            <Text style={styles.subButtonText}>공지사항</Text>
          </Pressable>
          <Pressable style={styles.subButton}>
            <Text style={styles.subButtonText}>문의하기</Text>
          </Pressable>
        </SizedView>
        <SizedView style={styles.mainButtonWrapper} width="100%" height={70}>
          <Pressable style={styles.subButton} onPress={onLogout}>
            <Text style={styles.subButtonText}>로그아웃</Text>
          </Pressable>
        </SizedView>
      </FlexView>
    </FlexView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: palette.grey_7},
  header: {
    padding: 30,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  hello: {fontSize: 16, fontWeight: '500', color: palette.grey_3},
  name: {fontSize: 24, fontWeight: '700', color: palette.grey_1, marginTop: 6},
  mypage: {fontSize: 14, fontWeight: '400', color: palette.grey_2},
  mainButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',

    flexWrap: 'wrap',
  },
  mainButton: {
    width: '50%',
    backgroundColor: palette.white,
    height: 80,
    borderWidth: 1,
    borderColor: palette.grey_7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  mainButtonIcon: {height: 30},
  mainButtonText: {
    fontSize: 18,
    height: 20,
    flex: 1,
    fontWeight: '700',
    color: palette.grey_1,
    textAlign: 'center',
  },
  subButton: {
    width: '100%',
    backgroundColor: palette.white,
    height: 70,
    borderWidth: 1,
    borderColor: palette.grey_7,
    alignContent: 'center',
    justifyContent: 'center',
  },
  subButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.grey_1,
    paddingLeft: 30,
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,

    borderRadius: 8,
    borderColor: 'blue',
  },
});

export default MyProfileScreen;
