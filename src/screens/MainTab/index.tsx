import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeStack from './HomeStack';
import {SettingStack} from 'screens/MainTab/SettingStack';
import {palette} from '@/constant';

const Tab = createBottomTabNavigator<MainTabParams>();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: palette.blue_1,
        tabBarInactiveTintColor: palette.grey_4,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({size, color}) => (
            <Icon size={size} color={color} name="home" />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingStack}
        options={{
          tabBarIcon: ({size, color}) => (
            <Icon size={size} color={color} name="user" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
