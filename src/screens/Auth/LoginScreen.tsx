import React, {useRef, useState} from 'react';
import {login} from '@react-native-seoul/kakao-login';
import {AuthStackNavigationProps} from './index';
import {palette} from '@constant/index';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import {LocalAuthState} from 'recoil/atoms';
import {BorderedInput, CustomButton} from '@components/common';
import * as Yup from 'yup';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useKakaoAuthActions} from 'recoil/actions';
import {useLocalAuthActions} from 'recoil/actions';
import {useSetRecoilState} from 'recoil';

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackNavigationProps>();
  const setLocalUser = useSetRecoilState(LocalAuthState);

  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const {login: localLogin} = useLocalAuthActions();
  const {loginKakao} = useKakaoAuthActions();

  const onPressRegister = () => {
    navigation.navigate('Register');
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('이메일은 필수입니다.'),
    password: Yup.string().required('비밀번호 입력은 필수입니다.'),
  });

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  };

  const signInWithKakao = async () => {
    const user: KakaoAuthUser = await login();
    loginKakao(user);
  };

  const onLocalLogin = async (userInfo: LoginRequest) => {
    const response = await localLogin(userInfo);
    if (response.status === 400) {
      setEmailError(response.data);
    } else if (response.status === 401) {
      setPasswordError(response.data);
    } else if (response !== null) {
      // 로그인 성공 후 처리
      await AsyncStorage.setItem(
        'parking-ppak-user',
        JSON.stringify(response.jwt),
      );
      setLocalUser(response as UserInfo);
    }
  };

  const passwordRef = useRef<TextInput>(null);

  return (
    <View style={styles.block}>
      <View style={styles.logo}>
        <Text>로고</Text>
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: LoginRequest) => {
          onLocalLogin(values);
        }}
        validateOnMount
        validationSchema={validationSchema}>
        {({values, handleSubmit, setFieldValue, isValid, errors, touched}) => (
          <>
            <BorderedInput
              value={values.email}
              onChangeText={text => {
                setFieldValue('email', text);
                if (emailError) {
                  setEmailError(undefined);
                }
              }}
              returnKeyType="next"
              placeholder="이메일"
              keyboardType="email-address"
              onEndEditing={() => passwordRef.current?.focus()}
              errorMessage={
                emailError ??
                (errors.email && touched.email ? errors.email : undefined)
              }
            />
            <BorderedInput
              ref={passwordRef}
              textContentType="password"
              returnKeyType="done"
              placeholder="비밀번호"
              value={values.password}
              onChangeText={text => {
                setFieldValue('password', text);
                if (passwordError) {
                  setPasswordError(undefined);
                }
              }}
              secureTextEntry
              errorMessage={
                passwordError ??
                (errors.password && touched.password
                  ? errors.password
                  : undefined)
              }
            />
            <CustomButton
              disabled={!isValid}
              onPress={handleSubmit}
              text="로그인"
            />
          </>
        )}
      </Formik>
      <Pressable style={styles.registerWrapper} onPress={onPressRegister}>
        <Text style={styles.appName}>파킹빡</Text>
        <Text style={styles.register}>회원가입</Text>
      </Pressable>
      <View style={styles.socialButtons}>
        <Pressable style={styles.social}>
          <ZocialIcon
            name="facebook"
            color={palette.blue_1}
            size={20}
            style={{marginRight: 6}}
          />
        </Pressable>
        <Pressable style={styles.social} onPress={signInWithKakao}>
          <MaterialIcon name="chat" color={palette.yellow_1} size={24} />
        </Pressable>
        <Pressable style={styles.social}>
          <AntIcon name="google" color="#2385f4" size={20} />
        </Pressable>
        <Pressable style={styles.social}>
          <MaterialIcon name="alpha-n" color={palette.green_1} size={36} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 140,
  },
  logo: {
    height: 100,
    backgroundColor: palette.grey_5,
    marginBottom: 20,
  },
  login: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 65,
    color: 'white',
  },
  registerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    height: 50,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 50,
    marginRight: 5,
    color: palette.blue_1,
  },
  register: {fontSize: 16, lineHeight: 50, color: palette.grey_1},
  socialButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  social: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: palette.grey_6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
});
