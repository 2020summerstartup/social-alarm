import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample, {switchValue} from '../../../components/toggleSwitch';
import Moment from 'moment';

import { alarmStyles } from '../../style/stylesheet';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import {createAlarm} from '../../../helpers/createAlarm';
import { MaterialIcons } from "@expo/vector-icons";

const moment = require("moment");

function Timer({ interval, style }) {
  const pad = (n) => n < 10 ? '0' + n : n // no zero hanging on left side if value less than 10
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds()/10)
  return (
    <View style = {alarmStyles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())}:</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  )
};

function AlarmBanner({ children }){
  return(
    <View style = {alarmStyles.alarmBanner}>{children}</View>
  )
};

function AlarmDetails({title, time}){
  return (
    <View style={alarmStyles.alarmDetails}>
      <Text style={alarmStyles.alarmTime}>{time}</Text>
      <Text style={alarmStyles.alarmText}>
        {title}
      </Text>
    </View>
  )
};

function AlarmsTable(){
  const [alarms, setAlarms] = useState([
      {name: 'First Alarm',  time: '3:15',  switch: 'false',  id: '1'},
      {name: 'Second Alarm', time: '4:15',  switch: 'false',  id: '2'},
      {name: 'Third Alarm',  time: '5:15',  switch: 'true',   id: '3'},
  ]);

  return(
     <View>
      {/*<ScrollView style = {alarmStyles.scrollView}>
            {alarms.map((list_item) => (
               <View key={list_item.key}>
                  <AlarmBanner>
                        <AlarmDetails title={list_item.name} time={list_item.time}/>
                        <SwitchExample/>
                        <Text>{list_item.switch}</Text>
                  </AlarmBanner>
               </View>
            ))}
      </ScrollView>*/}

      <FlatList
         keyExtractor ={(item) => item.id} // specifying id as the key to prevent the key warning
         data = {alarms}
         renderItem={({ item }) => (
            <AlarmBanner>
                  <AlarmDetails title={item.name} time={item.time}/>
                  <SwitchExample/>
                  <Text>{item.switch}</Text>
            </AlarmBanner>
         )}
      />
      </View>
  )
};

function TopBanner({ children }){
  return(
    <View style = {alarmStyles.topBanner}>{children}</View>
  )
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

var alarm_hour = 4
var alarm_minute = 45
var alarm_second = 0

const trigger = new Date(Date.now());
trigger.setHours(alarm_hour);
trigger.setMinutes(alarm_minute);
trigger.setSeconds(alarm_second);

/*Notifications.scheduleNotificationAsync({
  content: {
    title: 'Its' + alarm_minute + ':' + alarm_second+ '!',
  },
  trigger,
});*/

function AddAlarmButton({title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity 
      onPress ={() => !disabled && onPress()} //when not disabled
      style ={[alarmStyles.button, {backgroundColor: background}]}
      activeOpacity={disabled ? 1.0: 0.5} // means if disabled then 1.0, otherwise 0.5
    >
      <View style = {alarmStyles.buttonBorder}> 
        <Text style ={[ alarmStyles.buttonTitle, {color} ]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};

export default function AppAlarmsPage() {

  const [modalOpen, setModalOpen] = useState(false);


  class Alarm extends Component{
    state = {
      alarm_title: "This is the alarm title",
      alarm_hour: 0,
      alarm_minute: 0,
      alarm_second: 0
    };

    addAlarm = async () => {
      let {alarm_title, alarm_hour, alarm_minute, alarm_second} = this.state;

      if (!alarm_hour) {
        alert('Please enter an hour for the alarm');
      } 
      else {
        let newDate = date;
        if (moment(date).isBefore(moment().startOf('minute'))) {
          date = moment(date).add(1, 'days').startOf('minute').format();
        }
  
        await createAlarm({
          alarm_title
        });
      }
      
      var new_alarm = new Alarm()
      console.log("new_alarm before", new_alarm)
      new_alarm.state.alarm_title = "new_alarm_title"
      console.log("new_alarm after", new_alarm)
      /*new_alarm.alarm_hour = hour
      new_alarm.alarm_minute = minute
      new_alarm.alarm_second = second */
      const [rest_of_list] = this.state.alarm_list
      console.log("rest_of_list", rest_of_list)

      this.state.alarm_list = [new_alarm.state.alarm_title, rest_of_list]

      console.log("alarm added")
      console.log("this is the alarm_list:", this.state.alarm_list)
      console.log("end of print statements", "\n")
    }
  }

  class AlarmList extends Component{
    constructor(props) {
      super(props);
  
      this.state = {
        alarm_list: ["1st element of alarm_list"]
      }
    }

    addAlarm_alarmList = () => {
      let {title, hour, minute, second} = this.state;

      var new_alarm = new Alarm()
      console.log("new_alarm before", new_alarm)
      new_alarm.state.alarm_title = "new_alarm_title"
      console.log("new_alarm after", new_alarm)
      /*new_alarm.alarm_hour = hour
      new_alarm.alarm_minute = minute
      new_alarm.alarm_second = second */
      const [rest_of_list] = this.state.alarm_list
      console.log("rest_of_list", rest_of_list)

      this.state.alarm_list = [new_alarm.state.alarm_title, rest_of_list]

      console.log("alarm added")
      console.log("this is the alarm_list:", this.state.alarm_list)
      console.log("end of print statements", "\n")
    }
  }

  var my_alarms_list = new AlarmList();

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
    <View style={alarmStyles.container}>
      <TopBanner>
        <Text style={alarmStyles.pageTitle}>Alarms</Text>
        <MaterialIcons
            name="add"
            size={24}
            style={appStyles.modalToggle}
            onPress={() => setModalOpen(true)}
          />
        <Modal visible={modalOpen} animationType="slide">
          <View style={appStyles.modalContainer}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            <Text style={alarmStyles.Text}>
              DateTimePicker will go here
            </Text>
          </View>
        </Modal>
      </TopBanner>

      <View style={alarmStyles.scrollViewContainer}>
        {/* <Text>Your expo push token: {expoPushToken}</Text>*/}
        {/*<View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
        </View>*/}
        <AlarmsTable/>
        <Button
          title="Send a notification now"
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        />
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
