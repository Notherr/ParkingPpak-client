import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import MyProfileScreen from './MyProfileScreen';
import CardScreen from './CardScreen';
import OilScreen from './OilScreen';
import LikeScreen from './LikeScreen';
import NavigationScreen from './NavigationScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';

const Stack = createNativeStackNavigator();

function SettingStack({navigation}: NativeStackScreenProps<any>) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Like"
        component={LikeScreen}
        options={{
          title: '찜 목록',
          headerLeft: props => (
            <Icon
              name="arrow-back-ios"
              onPress={() => navigation.pop()}
              size={20}
              color={palette.grey_1}
            />
          ),
        }}
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
