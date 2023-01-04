import React, {useEffect} from 'react';
import {Alert, Button, Platform, SafeAreaView} from 'react-native';
import {getMyStringValue, setStringValue} from './src/asyncStorage';
import {
  getFCMToken,
  requestUserPermission,
} from './src/notification/requestPermission';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer} from '@react-navigation/native';
import HomeStackNavigator from './src/stackNavigator/HomeStack';

const App = () => {
  useEffect(() => {
    const fcmTokenValue = getMyStringValue('fcmToken');
    if (!fcmTokenValue) {
      if (requestUserPermission()) {
        const fcmToken = getFCMToken();
        setStringValue('fcmToken', fcmToken);
      }
    }

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      Alert.alert(
        'Notification caused app to open from background state:',
        JSON.stringify(remoteMessage),
      );
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const message = remoteMessage.notification;
      console.log('A new FCM message arrived!', message.title);
      onMessageReceived({
        id: '123',
        title: message.title,
        message: message.body,
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotification,
      );
    } else {
      // requestCameraPermission();
    }
  });

  const onRemoteNotification = notification => {
    console.log('onRemoteNotification setApplicationIconBadgeNumber');
    // PushNotificationIOS.setApplicationIconBadgeNumber(2);
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      console.log('notification clicked!');
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };

  return (
    <NavigationContainer>
      <HomeStackNavigator />
    </NavigationContainer>
  );
};

export default App;
