import React, { useState, useEffect, useRef, Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView, Modal, FlatList, AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample, {switchValue} from '../components/toggleSwitch';
import Moment from 'moment';

import { APPBACKGROUNDCOLOR } from './constants';
import { appStyles } from './stylesheet';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import {createAlarm} from '../helpers/createAlarm';
import { MaterialIcons } from "@expo/vector-icons";

const moment = require("moment");

// function Timer({ interval, style }) {
//   const pad = (n) => n < 10 ? '0' + n : n // no zero hanging on left side if value less than 10
//   const duration = moment.duration(interval)
//   const centiseconds = Math.floor(duration.milliseconds()/10)
//   return (
//     <View style = {styles.timerContainer}>
//       <Text style={style}>{pad(duration.minutes())}:</Text>
//       <Text style={style}>{pad(duration.seconds())}:</Text>
//       <Text style={style}>{pad(centiseconds)}</Text>
//     </View>
//   )
// };

function AlarmBanner({ children }){
  return(
    <View style = {styles.alarmBanner}>{children}</View>
  )
};

function AlarmDetails({title, hour, minute, second}){
  return (
    <View style={styles.alarmDetails}>
      <Text style={styles.alarmTime}>{hour}:{minute}:{second}</Text>
      <Text style={styles.alarmText}>
        {title}
      </Text>
    </View>
  )
};

async function makeAlarms(alarm_array){
    alarm_array.forEach(list_item => {
        if (list_item.switch == true){
            console.log("inside maps function");

            // let promise;
            // promise = Notifications.scheduleNotificationAsync({
            Notifications.scheduleNotificationAsync({
                identifier: list_item.name,
                content: {title: 'Its ' + list_item.alarm_hour + ':' + list_item.alarm_minute + '!'},
                
                // DailyTriggerInput
                trigger: {
                    hour: list_item.alarm_hour,
                    minute: list_item.alarm_minute,
                    repeats: false
                }
            });
            console.log("identifier:", list_item.name)
            // console.log("promise:", promise)
        }
    });
    list = (await Notifications.getAllScheduledNotificationsAsync());
    return list;
}

function AlarmsTable(){
    const [alarms, setAlarms] = useState([
        {name: 'First Alarm',  alarm_hour: 3, alarm_minute: 15, alarm_second: 0, switch: true,  id: '1'},
        {name: 'Second Alarm', alarm_hour: 10, alarm_minute: 49, alarm_second: 0, switch: true,  id: '2'},
        {name: 'Third Alarm',  alarm_hour: 10, alarm_minute: 50, alarm_second: 0, switch: true,  id: '3'},
    ]);

    makeAlarms(alarms).then(list => {console.log("list:", list)})

    return(
        <View>
        {/*<ScrollView style = {styles.scrollView}>
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
                <AlarmDetails title={item.name} hour={item.alarm_hour} minute={item.alarm_minute} second={item.alarm_second}/>
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
    <View style = {styles.topBanner}>{children}</View>
  )
};

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

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function AppAlarmsPage() {

    const [modalOpen, setModalOpen] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false); // false is the initial state so it's passed into useState()
    const notificationListener = useRef();
    const responseListener = useRef();
    const [name, setName] = useState();


    const save = async() => {
        try {
            await AsyncStorage.setItem("MyName", name)
        }
        catch(err){
            alert(err);
        }
    };

    const load = async() => {
        try{
            await AsyncStorage.getItem("MyName")
        }
        catch(err){
            alert(err);
        }
    }

    useEffect(() => { // useEffect is similar to componentDidMount and componentDidUpdate
        // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token))
            .catch(console.log(".catch"))
            // .catch(error => {
            //     console.log(".catch", error)
            // })

        // registerForPushNotificationsAsync().then(console.log(".then")).catch(console.log(".catch"));

        // let the_subscription;
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log("addNotificationReceivedListener");
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("hi", response);
        });

        // let info_promise;
        // info_promise = Notifications.getPresentedNotificationsAsync(list => {
        //     console.log("list:", list)
        //     console.log("inside")
        // });
        // console.log("info_promise_before:", info_promise)

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };

        // return () => {
        //   Notifications.removeAllNotificationListeners();
        // };

        // Notifications.cancelAllScheduledNotificationsAsync();
        // Notifications.dismissAllNotificationsAsync();
    }, []);

    return (
        <View style={styles.container}>
        <TopBanner>
            <Text style={styles.pageTitle}>Alarms_Testing</Text>
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
                <Text style={styles.Text}>
                DateTimePicker will go here
                </Text>
            </View>
            </Modal>
        </TopBanner>

        <View style={styles.scrollViewContainer}>
            <Button
            title="Send a notification now"
            onPress={async () => {
                await sendPushNotification(expoPushToken);
            }}
            />
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
            </View>
            <AlarmsTable/>
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
        // Check for existing permissions
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log("existingStatus: ", existingStatus);
        let finalStatus = existingStatus;

        // If no existing permissions, ask user for permission
        if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
        }

        // If no permission, exit the function
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }

        // Get push notification token
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("token: ", token);
    } 
    else {
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
    // backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },

  scrollViewContainer: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    padding: 0
  },

  timerContainer: {
    flexDirection: "row",
  },

  lapTimer:{
    width: 25,
  },

  topBanner:{
    flexDirection : "row",
    width:"100%",
    backgroundColor: "black",
    // backgroundColor: "white",
    // backgroundColor: APPBACKGROUNDCOLOR,
    height: 110,
    paddingTop: 30,
    paddingBottom: 0,
    padding: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: "space-between",
  },

  Text:{
    height:50,
    color: "white",
    fontSize: 16
  },

  pageTitle:{
    padding: 20,
    color: "#fb5b5a",
    fontSize: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    // backgroundColor: "black",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 40,
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
