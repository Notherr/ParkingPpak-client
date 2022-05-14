import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'parking-ppak-user';

const authStorage = {
  async get() {
    const rawData = await AsyncStorage.getItem(AUTH_KEY);
    if (!rawData) {
      return null;
    }
    try {
      const data: UserInfo = JSON.parse(rawData);
      return data;
    } catch (e) {
      return null;
    }
  },
  set(authResult: UserInfo) {
    return AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authResult));
  },
  clear() {
    return AsyncStorage.removeItem(AUTH_KEY);
  },
};

export default authStorage;
