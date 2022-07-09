import React, {useRef, useState} from 'react';
import {login, getProfile} from '@react-native-seoul/kakao-login';
import {AuthStackNavigationProps} from './index';
import {palette} from '@constant/index';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Formik} from 'formik';
import {BorderedInput, CustomButton} from '@components/common';
import * as Yup from 'yup';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {useKakaoAuthActions, useLocalAuthActions} from 'recoil/actions';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.email'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '452065527838-h0oastn5pmuhtn32o72j3vjihjjn8qvh.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  // hostedDomain: '', // specifies a hosted domain restriction
  // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  // accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId:
    '452065527838-h0oastn5pmuhtn32o72j3vjihjjn8qvh.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackNavigationProps>();

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
    await login();
    await getProfile().then(res => console.log(res));
    // {"ageRange": null, "ageRangeNeedsAgreement": null, "birthday": null, "birthdayNeedsAgreement": null, "birthdayType": null, "birthyear": null, "birthyearNeedsAgreement": null, "email": "tsc03018@naver.com", "emailNeedsAgreement": false, "gender": null, "genderNeedsAgreement": false, "id": "2333953287", "isEmailValid": true, "isEmailVerified": true, "isKorean": null, "isKoreanNeedsAgreement": null, "nickname": "도혜원", "phoneNumber": null, "phoneNumberNeedsAgreement": null, "profileImageUrl": null, "profileNeedsAgreement": false, "thumbnailImageUrl": null}

    // if (user) {
    //   loginKakao(user).then(user => console.log(user));
    // }
  };

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn().then(({user}) => console.log(user));
    // {"email": "tsc03018@gmail.com", "familyName": "do", "givenName": "hye won", "id": "103471963232679908403", "name": "hye won do", "photo": "https://lh3.googleusercontent.com/a/AItbvmkmMilD1NmH7IMcDqoopMd1qWIxIm_Kj5vFVM92=s120"}
  };

  const onLocalLogin = async (userInfo: LoginRequest) => {
    const response = await localLogin(userInfo);
    if (response.statusCode === 400) {
      setEmailError(response.message);
    } else if (response.statusCode === 401) {
      setPasswordError(response.message);
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
        <Pressable style={styles.social} onPress={signInWithGoogle}>
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
