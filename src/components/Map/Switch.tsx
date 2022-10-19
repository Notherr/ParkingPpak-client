import {palette} from '@/constant';
import {View, Pressable, StyleSheet, Animated} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';

type Option<T> = {
  label: string;
  value: T;
};

type SwitchProps<T> = {
  onToggle: (value: T) => void;
  options: [Option<T>, Option<T>];
  value: T;
};

export default function Switch<T>({onToggle, options, value}: SwitchProps<T>) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: options.findIndex(option => option.value !== value),
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // 애니메이션 처리 완료 후 실행할 작업
    });
  }, [value]);

  return (
    <View style={[styles.container]}>
      {options.map((option, index) => (
        <Pressable
          key={option.label}
          style={[
            styles.textWrapper,
            index === 0 && {left: 5},
            index === 1 && {right: 5},
          ]}
          onPress={() =>
            onToggle(index === 0 ? options[1].value : options[0].value)
          }
          hitSlop={{top: 10, bottom: 10}}>
          <Animated.Text
            style={[
              styles.text,
              {
                color: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange:
                    index === 0
                      ? [palette.blue_2, palette.white]
                      : [palette.white, palette.blue_2],
                }),
              },
            ]}>
            {option.label}
          </Animated.Text>
        </Pressable>
      ))}

      <Animated.View
        style={[
          styles.active,
          {
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, 70],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 20,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    backgroundColor: palette.blue_2,
    top: 130,
    borderRadius: 30,
    alignSelf: 'center',
  },
  textWrapper: {
    width: 75,
    zIndex: 5,
    position: 'absolute',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: palette.white,
  },
  active: {
    position: 'absolute',
    backgroundColor: palette.white,
    top: 5,
    width: 75,
    left: 0,
    borderRadius: 20,
    height: 30,
    zIndex: 4,
  },
});
