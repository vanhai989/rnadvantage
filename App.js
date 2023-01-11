import React, {useEffect} from 'react';
import {Alert, Button, Linking, Platform, SafeAreaView} from 'react-native';
import {getMyStringValue, setStringValue} from './src/asyncStorage';
import {
  getFCMToken,
  requestUserPermission,
} from './src/notification/requestPermission';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer} from '@react-navigation/native';
// import DeepLinking from 'react-native-deep-linking';
import HomeStackNavigator from './src/stackNavigator/HomeStack';
import {onMessageReceived} from './src/routers/homeScreen';

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

    Linking.getInitialURL().then(url => {
      console.log('getInitialURL', url);
    });

    const linkListener = Linking.addEventListener('url', handleOpenURL);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const message = remoteMessage.notification;
      console.log('A new FCM message arrived!', message.title);
      onMessageReceived({
        id: '123',
        title: message.title,
        message: message.body,
      });
    });
    return () => {
      unsubscribe;
      Linking.removeEventListener(linkListener);
    };
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

  const handleOpenURL = event => {
    // const route = event.url.replace(/.*?:\/\//g, '');
    // console.log(event.url);
    // console.log('route', route);
    console.log('event', event);

    // do something with the url, in our case navigate(route)
  };

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

  // const addRoutesToDeepLinking = () => {
  //   DeepLinking.addScheme('https://');

  //   DeepLinking.addRoute('/testurl.com/#/sign-in', response => {
  //     navigate('');
  //   });

  //   DeepLinking.addRoute('/testurl.com', response => {
  //     navigate('');
  //   });

  //   DeepLinking.addRoute('/testurl.com/#/main/upcoming', response => {
  //     navigate('');
  //   });
  // };

  return (
    <NavigationContainer>
      <HomeStackNavigator />
    </NavigationContainer>
  );
};

export default App;
