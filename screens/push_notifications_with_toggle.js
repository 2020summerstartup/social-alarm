import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample from '../components/toggleSwitch';
// import { createAlarm } from '../node_modules/react-native-simple-alarm';
import moment from 'moment'

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const trigger = new Date(Date.now());
// trigger.setHours(5);
trigger.setMinutes(56);
trigger.setSeconds(0);

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Its 5:56!',
  },
  trigger,
});

/*export default class HomeContainer extends Component 
{
    
    render() {
       return (
          <View style={styles.container}>
             <SwitchExample />
          </View>
       );
    }
 }
 */

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity 
      onPress ={() => !disabled && onPress()} //when not disabled
      style ={[styles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0: 0.5} // means if disabled then 1.0, otherwise 0.5
    >
      <View style = {styles. buttonBorder}> 
        <Text style ={[ styles.buttonTitle, {color} ]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log("hi", response);
    });

    /* return () => {
      Notifications.removeAllNotificationListeners();
    };*/
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // 'space-around',
      }}>
      {/* <Text>Your expo push token: {expoPushToken}</Text>*/}
      {/*<View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
        
      </View>*/}
      {/* <View style={styles.container}>
             <SwitchExample />
      </View>*/}
      <Button
        title="Send a notification now"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
      <Button
        title="Send a notification in 5 seconds"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Hello Sidney',
    body: 'This is a notification for you!',
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#f786f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
