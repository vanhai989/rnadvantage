import React, {useEffect} from 'react';
import {Alert, Button, Platform, SafeAreaView} from 'react-native';
import {getMyStringValue, setStringValue} from './src/asyncStorage';
import {
  getFCMToken,
  requestUserPermission,
} from './src/notification/requestPermission';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from './src/routers/Chat';
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

  // test push notification here
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
    if (Platform.OS === 'android') {
      console.log('pushLocal android');

      PushNotification.localNotification({
        channelId: 'default-channel-id', // (required)
        channelName: 'My channel', // (required)
        autoCancel: true,
        bigText: 'this is local push notification text',
        subText: 'local nofification subtext',
        title: 'local notification title',
        message: 'hey, expand me',
        channelDescription: 'A My channel', // (optional) default: undefined.
        playSound: true,
        importance: 10,
        soundName: 'default',
        vibrate: true,
        vibration: 1000,
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
    if (Platform.OS === 'android') {
      PushNotification.cancelLocalNotification('123');
    }
  };

  function HomeScreen() {
    const navigation = useNavigation();
    const goToScreen = router => {
      navigation.navigate(router);
    };
    return (
      <SafeAreaView>
        <Button title="feature chat" onPress={() => goToScreen('Chat')} />
        <Button title="feature chat" onPress={() => goToScreen('Chat')} />
      </SafeAreaView>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
