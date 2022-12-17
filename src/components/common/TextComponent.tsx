import React from 'react';
import {Text} from 'react-native';

function TextComponent({children, style = {}}: TextType) {
  return <Text style={style}>{children}</Text>;
}

export default TextComponent;
