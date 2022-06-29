import React from 'react';
import {palette} from '@constant/index';
import {
  StyleSheet,
  Pressable,
  PressableProps,
  Text,
  Platform,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type ButtonColor = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium';

type CustomButtonProps = PressableProps & {
  text: string;
  color?: ButtonColor;
  size?: ButtonSize;
  iconName?: string;
};

export default function CustomButton({
  disabled,
  text,
  color = 'primary',
  size = 'medium',
  iconName,
  ...rest
}: CustomButtonProps) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        buttonStyles(size, color, !!disabled).button,
        Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
      ]}
      disabled={disabled}
      {...rest}>
      {iconName && (
        <MaterialIcon
          name={iconName}
          color={palette.white}
          size={20}
          style={styles.icon}
        />
      )}
      <Text style={textStyles(color, !!disabled).text}>{text}</Text>
    </Pressable>
  );
}

const textStyles = (color: ButtonColor, disable?: boolean) =>
  StyleSheet.create({
    text: {
      fontSize: 20,
      height: 20,
      textAlign: 'center',
      color:
        color === 'primary'
          ? 'white'
          : disable
          ? palette.grey_5
          : palette.blue_2,
    },
  });

const buttonStyles = (
  size: ButtonSize,
  color: ButtonColor,
  disable?: boolean,
) =>
  StyleSheet.create({
    button: {
      ...(size === 'medium' ? {height: 56} : {height: 40}),
      ...(color === 'primary'
        ? {backgroundColor: disable ? palette.grey_5 : palette.blue_2}
        : {
            borderColor: disable ? palette.grey_5 : palette.blue_2,
            borderWidth: 1,
            color: palette.blue_2,
          }),
    },
  });

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {height: 20, marginRight: 4},
});
