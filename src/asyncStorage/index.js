import AsyncStorage from '@react-native-async-storage/async-storage';

const setStringValue = async value => {
  try {
    await AsyncStorage.setItem('key', value);
  } catch (e) {
    // save error
  }
};

const setObjectValue = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('key', jsonValue);
  } catch (e) {
    // save error
  }
};

const getMyStringValue = async () => {
  try {
    return await AsyncStorage.getItem('@key');
  } catch (e) {
    // read error
  }
};

const getMyObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // read error
  }
};

export {setStringValue, setObjectValue, getMyStringValue, getMyObject};
