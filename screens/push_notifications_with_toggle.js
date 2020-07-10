import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample, {switchValue} from '../components/toggleSwitch';
// import { createAlarm } from '../node_modules/react-native-simple-alarm';
import Moment from 'moment';

import {APPBACKGROUNDCOLOR} from './constants';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const moment = require("moment");

function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n // no zero hanging on left side if value less than 10
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds()/10)
  return (
    <View style = {styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())}:</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  )
};

function AlarmBanner({ children }){
  return(
    <View style = {styles.alarmBanner}>{children}</View>
  )
};

function AlarmDetails({title}){
  return (
    <View style={styles.alarmDetails}>
      <Text style={styles.alarmTime}>
        {alarm_hour}:{alarm_minute}:{alarm_second}
      </Text>
      <Text style={styles.alarmText}>
        {title}
      </Text>
    </View>
  )
};

function AlarmsTable(){
  var theSwitchIsOn = 'false'
  if(switchValue == true){
    theSwitchIsOn = 'true'
  }
  return(
    <ScrollView style = {styles.scrollView}>
      <AlarmBanner>
        <AlarmDetails title='Alarm Title 1'/>
        <SwitchExample/>
        <Text>{theSwitchIsOn}</Text>
      </AlarmBanner>

      <AlarmBanner>
        <AlarmDetails title='Alarm Title 2'/>
        <SwitchExample/>
        <Text>{theSwitchIsOn}</Text>
      </AlarmBanner>
    </ScrollView>
  )
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

var alarm_hour = 4
var alarm_minute = 31
var alarm_second = 0

const trigger = new Date(Date.now());
trigger.setHours(alarm_hour);
trigger.setMinutes(alarm_minute);
trigger.setSeconds(alarm_second);

Notifications.scheduleNotificationAsync({
  content: {
    title: 'Its' + alarm_minute + ':' + alarm_second+ '!',
  },
  trigger,
});

function AddAlarmButton({title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity 
      onPress ={() => !disabled && onPress()} //when not disabled
      style ={[styles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0: 0.5} // means if disabled then 1.0, otherwise 0.5
    >
      <View style = {styles.buttonBorder}> 
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Set your alarm hour"
          placeholderTextColor="#ffffff"
          // onChangeText={this.alarm_hour}
        />
      </View>

      <AddAlarmButton 
          title = "Add Alarm" 
          color = "white"
          background = '#858585'
        />

      <Text style={styles.alarmText}>You have an alarm set for {alarm_hour}:{alarm_minute}:{alarm_second}</Text>

      <View style={styles.container}>
        {/* <Text>Your expo push token: {expoPushToken}</Text>*/}
        {/*<View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
        </View>*/}

        <AlarmsTable/>

        <Text style={styles.alarmText}>You have an alarm set for + alarm_minute + ":" alarm_second</Text>
        <Button
          title="Send a notification now"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
        {/* <Button
          title="Send a notification in 5 seconds"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        /> */}
      </View>
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
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingBottom: 10
  },

  timerContainer: {
    flexDirection: "row",
  },

  lapTimer:{
    width: 25,
  },

  inputText:{
    height:50,
    color: "#ffffff",
    fontSize: 16
  },

  inputView:{
    width:"50%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },

  alarmTime: {
    color: "#ffffff",
    fontSize: 45,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  alarmText: {
    color: "#ffffff",
    fontSize: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  alarmBanner: {
    flex: 1,
    flexDirection : "row",
    backgroundColor: "#fb5b5a",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: "95%",
    borderRadius: 15
  },

  alarmDetails: {
    flex: 1,
    backgroundColor: "#fb5b5a",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    borderRadius: 15
  },

  scrollView: {
    alignSelf: 'stretch',
    alignContent: 'center',
  }, 

  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }, 

  buttonTitle: {
    color: "#ffffff",
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonBorder: {
    color: "#ffffff",
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

