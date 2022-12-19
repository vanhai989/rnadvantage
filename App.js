import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Platform, SafeAreaView, StyleSheet} from 'react-native';
import {getMyStringValue, setStringValue} from './src/asyncStorage';
import {
  getFCMToken,
  requestUserPermission,
} from './src/notification/requestPermission';
// import './src/notification';
import messaging from '@react-native-firebase/messaging';
// import RemotePushController from './src/notification/RemotePushController';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [state, setState] = useState({});
  useEffect(() => {
    if (requestUserPermission()) {
      const fcmToken = getFCMToken();
      setStringValue('fcmToken', fcmToken);
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
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onMessageReceived({
        id: '123',
        title: message.title,
        message: message.body,
      });
    });

    console.log('background_message', getMyStringValue('background_message'));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotification,
      );
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

  const pushLocal = () => {
    console.log('pushLocal');
    const messages = {
      channelId: 'default-channel-id',
      vibrate: false,
      id: 0,
      title: 'title',
      message: 'body123',
      data: 'data',
    };
    onMessageReceived(messages);
  };

  const onMessageReceived = remoteMessage => {
    console.log('onMessageReceived');
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: 'default-channel-id',
        vibrate: false,
        id: 0,
        title: remoteMessage.title,
        message: remoteMessage.body,
        picture:
          'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
      });
    } else {
      PushNotification.localNotification({
        id: remoteMessage.messageId,
        title: remoteMessage.title,
        message: remoteMessage.message,
        picture:
          'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
      });
    }
  };

  return (
    <SafeAreaView>
      <Button title="push local" onPress={pushLocal} />
      {/* <RemotePushController /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
