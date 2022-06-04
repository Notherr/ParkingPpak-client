import React, {useEffect, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import authStorage from '@/storages/authStorage';
import MainTab from './MainTab';
import {MapStack} from '@/screens/Map';
import {SearchScreen} from '@/screens/Search';
import Auth from './Auth';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {isLoading, LocalAuthState} from 'recoil/atoms';
import {Loading} from '@/components/common';

export type RootStackNavigationProps =
  NativeStackNavigationProp<RootStackParams>;

const Stack = createNativeStackNavigator<RootStackParams>();

function RootStack() {
  const setLocalUser = useSetRecoilState(LocalAuthState);
  const setIsLoading = useSetRecoilState(isLoading);
  const isLodingState = useRecoilValue(isLoading);
  const [auth, setAuth] = useState<boolean>(false);
  const userInfo = useRecoilValue(LocalAuthState);

  // localStorage에 내 정보가 저장되어있는지 확인
  useEffect(() => {
    (async () => {
      const userToken = await authStorage.get();

      if (userToken) {
        setLocalUser(userToken);
        setAuth(true);
      }
      setTimeout(() => setIsLoading(false), 2000);
    })();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [userInfo]);

  if (isLodingState) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={auth ? 'MainTab' : 'Auth'}>
      {!auth ? (
        <>
          <Stack.Screen name="MainTab" component={MainTab} />
          <Stack.Screen
            name="Map"
            component={MapStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={Auth} />
      )}
    </Stack.Navigator>
  );
}

export default RootStack;
