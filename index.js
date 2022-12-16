/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotification.createChannel(
  {
    channelId: 'default-channel-id', // (required)
    channelName: 'Default channel', // (required)
    channelDescription: 'A default channel', // (optional) default: undefined.
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  created =>
    console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

PushNotification.configure({
  onRegister: function (token) {
    // if (Platform.OS === 'android') {
    //   FCM_TOKEN.token = token.token;
    //   console.log('TOKEN:', token.token);
    // }
  },
  onNotification: function (notification) {
    console.log('Notification root: ', notification);
    if (!notification) {
      return;
    }
    // if (notification.badge) {
      // let badgeNumber = notification.badge;
      PushNotificationIOS.setApplicationIconBadgeNumber(10);
      if (
        Platform.OS === 'ios' &&
        notification &&
        notification.finish &&
        typeof notification.finish === 'function'
      ) {
        if (
          notification &&
          PushNotificationIOS &&
          PushNotificationIOS.FetchResult &&
          PushNotificationIOS.FetchResult.NoData
        ) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      }
    // }
    if (notification?.userInteraction) {
      handleTapNotification(notification).then(res => {});
    }
  },
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION ON ACTION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const handleTapNotification = async notification => {
  console.log('Handle tap notification');
};


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     console.log('HeadlessCheck', isHeadless);
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return App;
// }

AppRegistry.registerComponent(appName, () => App);
