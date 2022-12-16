import messaging, {firebase} from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFCMToken() {
  const fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    console.log('fcmToken', fcmToken);
    return fcmToken;
  } else {
    console.log('failed get fcmToken!');
    return null;
  }
}
