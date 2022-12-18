/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {setStringValue} from './src/asyncStorage';

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

// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   setStringValue('background_message', 'background message is called!');
//   console.log('Message handled in the background!', remoteMessage);
// });

// function HeadlessCheck({isHeadless}) {
//   if (isHeadless) {
//     console.log('HeadlessCheck', isHeadless);
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return App;
// }

AppRegistry.registerComponent(appName, () => App);
