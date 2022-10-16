import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {palette} from '@/constant';

type ToggleCardType = ComponentCssType & {
  title: string;
  openOnMount?: boolean;
};

export default function ToggleCard({
  title,
  openOnMount = false,
  children,
}: ToggleCardType) {
  const [showChildren, setShowChildren] = useState(openOnMount);

  const onPress = () => {
    setShowChildren(!showChildren);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable style={styles.button} onPress={onPress}>
          <Icon
            name={showChildren ? 'chevron-down' : 'chevron-up'}
            size={24}
            color={palette.grey_2}
          />
        </Pressable>
      </View>
      {showChildren && children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomColor: palette.grey_7,
    borderBottomWidth: 1,
  },
  title: {flex: 1, color: palette.grey_2, fontSize: 16},
  button: {
    height: 24,
    width: 24,
  },
});
