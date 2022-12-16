// import React, {useEffect, useRef, useState} from 'react';
// import {Alert, Button, SafeAreaView, StyleSheet} from 'react-native';
// import {setStringValue} from './src/asyncStorage';
// import {
//   getFCMToken,
//   requestUserPermission,
// } from './src/notification/requestPermission';
// // import './src/notification';
// import messaging from '@react-native-firebase/messaging';
// import RemotePushController from './src/notification/RemotePushController';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import PushNotification from 'react-native-push-notification';
// import NotifService from './src/notification/NotifService';

// const App = () => {
//   const notif = useRef(null);
//   const [state, setState] = useState({});
//   useEffect(() => {
//     notif.current = new NotifService(onRegister, onNotif);
//     if (requestUserPermission()) {
//       const fcmToken = getFCMToken();
//       setStringValue('fcmToken', fcmToken);
//     }

//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log(
//         'Notification caused app to open from background state:',
//         remoteMessage.notification,
//       );
//       Alert.alert(
//         'Notification caused app to open from background state:',
//         JSON.stringify(remoteMessage),
//       );
//     });

//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       PushNotification.localNotif({
//         title: 'notification.title',
//         message: 'notification.body!',
//       });
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     PushNotificationIOS.addEventListener('notification', onRemoteNotification);
//   });
//   const onRemoteNotification = notification => {
//     console.log('onRemoteNotification setApplicationIconBadgeNumber');
//     PushNotificationIOS.setApplicationIconBadgeNumber(2);
//     const isClicked = notification.getData().userInteraction === 1;

//     if (isClicked) {
//       console.log('notification clicked!');
//       // Navigate user to another screen
//     } else {
//       // Do something else with push notification
//     }
//   };

//   const pushLocal = () => {
//     console.log('pushLocal', notif.current);
//     notif.current.localNotif('sample.mp3');
//   };

//   const onRegister = token => {
//     setState({registerToken: token.token, fcmRegistered: true});
//   };

//   const onNotif = notif => {
//     Alert.alert(notif.title, notif.message);
//   };

//   return (
//     <SafeAreaView>
//       <Button title="push local" onPress={pushLocal} />
//       <RemotePushController />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({});

// export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, {Component} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import NotifService from './src/notification/NotifService';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Example app react-native-push-notification
        </Text>
        <View style={styles.spacer} />
        <TextInput
          style={styles.textField}
          value={this.state.registerToken}
          placeholder="Register token"
        />
        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.localNotif();
          }}>
          <Text>Local Notification (now)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.localNotif('sample.mp3');
          }}>
          <Text>Local Notification with sound (now)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.scheduleNotif();
          }}>
          <Text>Schedule Notification in 30s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.scheduleNotif('sample.mp3');
          }}>
          <Text>Schedule Notification with sound in 30s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.cancelNotif();
          }}>
          <Text>Cancel last notification (if any)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.cancelAll();
          }}>
          <Text>Cancel all notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.checkPermission(this.handlePerm.bind(this));
          }}>
          <Text>Check Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.requestPermissions();
          }}>
          <Text>Request Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.abandonPermissions();
          }}>
          <Text>Abandon Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getScheduledLocalNotifications(notifs =>
              console.log(notifs),
            );
          }}>
          <Text>Console.Log Scheduled Local Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getDeliveredNotifications(notifs => console.log(notifs));
          }}>
          <Text>Console.Log Delivered Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.createOrUpdateChannel();
          }}>
          <Text>Create or update a channel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.popInitialNotification();
          }}>
          <Text>popInitialNotification</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        {this.state.fcmRegistered && <Text>FCM Configured !</Text>}

        <View style={styles.spacer} />
      </View>
    );
  }

  onRegister(token) {
    this.setState({registerToken: token.token, fcmRegistered: true});
  }

  onNotif(notif) {
    Alert.alert(notif.title, notif.message);
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 5,
    padding: 5,
    width: '70%',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  textField: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    margin: 5,
    padding: 5,
    width: '70%',
  },
  spacer: {
    height: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
});
