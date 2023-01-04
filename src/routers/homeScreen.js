import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PushNotification from 'react-native-push-notification';

const HomeScreen = () => {
  const navigation = useNavigation();
  const goToScreen = router => {
    navigation.navigate(router);
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

  return (
    <SafeAreaView>
      <Button title="local push notification" onPress={pushLocal} />
      <View style={{marginTop: 100}}>
        <Text style={{textAlign: 'center', fontSize: 24, marginBottom: 10}}>
          list screens
        </Text>
        <Button title="feature chat" onPress={() => goToScreen('Chat')} />
        <Button
          title="ReactHookForm"
          onPress={() => goToScreen('ReactHookForm')}
        />
      </View>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
});

export default HomeScreen;
