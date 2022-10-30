import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {palette} from '@/constant';
import {View, Pressable, StyleSheet, TextInput, Platform} from 'react-native';

type SearchBoxProp = NativeStackScreenProps<any> & {
  onSearch: (keyword: string) => void;
};

function SearchBox({navigation, onSearch}: SearchBoxProp) {
  const {top} = useSafeAreaInsets();

  const [input, setInput] = useState<string>();

  const goToBackScreen = () => navigation.pop();

  return (
    <View style={[styles.wrapper, {top}]}>
      <View style={styles.borderContainer}>
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={goToBackScreen}>
          <Icon name="arrow-back" size={20} style={styles.icon} />
        </Pressable>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="장소를 검색하세요"
        />
        <Pressable
          style={({pressed}) => [
            styles.button,
            Platform.OS === 'ios' && {opacity: pressed ? 0.6 : 1},
          ]}
          android_ripple={{color: palette.white}}
          onPress={() => {
            input && onSearch(input);
          }}>
          <Icon
            name="search"
            size={24}
            style={styles.search}
            color={palette.grey_2}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    zIndex: 3,
  },
  borderContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: palette.white,
    paddingLeft: 10,
    paddingRight: 20,
    shadowColor: '#8B8B8B',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    elevation: 3,
  },
  button: {
    justifyContent: 'center',
  },
  icon: {
    color: palette.grey_3,
  },
  input: {
    marginVertical: 6,
    padding: 10,
    flex: 1,
  },
  search: {},
});

export default SearchBox;
