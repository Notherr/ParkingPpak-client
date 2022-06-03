import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyProfileScreen from './MyProfileScreen';
import CardScreen from './CardScreen';
import OilScreen from './OilScreen';
import NavigationScreen from './NavigationScreen';

const Stack = createNativeStackNavigator();

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Card"
        component={CardScreen}
        options={{title: '카드 설정'}}
      />
      <Stack.Screen
        name="Oil"
        component={OilScreen}
        options={{title: '오일 설정'}}
      />
      <Stack.Screen
        name="Nav"
        component={NavigationScreen}
        options={{title: '네비게이션 앱 설정'}}
      />
    </Stack.Navigator>
  );
}

export default SettingStack;
