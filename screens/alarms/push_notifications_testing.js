import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, View, Switch, Text, Platform, TouchableOpacity, Modal, Animated, Image, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from "@expo/vector-icons";

import SwitchExample, {switchValue} from '../../components/toggleSwitch';
import { appStyles, alarmStyles } from '../../style/stylesheet';

// import DatePicker from 'react-native-modern-datepicker'; 
import TimePicking from '../../components/timePicker';
import {time} from '../../components/timePicker';

import { db, auth } from "../../firebase/firebase";


// const rowSwipeAnimatedValues = {};

function AlarmBanner({ children }){
    return(
        <View style = {alarmStyles.alarmBanner}>{children}</View>
    )
};

function AlarmDetails({title, hour, minute, second}){
    return (
        <View style={alarmStyles.alarmDetails}>
            <Text style={alarmStyles.alarmTime}>{hour}:{minute}:{second}</Text>
            <Text style={alarmStyles.alarmText}>{title}</Text>
        </View>
    )
};

async function makeAlarms(alarm_array){
    alarm_array.forEach(async(list_item) => {
        if (list_item.switch == true){
            // console.log("inside maps function");
            promise = (await Notifications.scheduleNotificationAsync({
                identifier: list_item.name,
                content: {
                    title: 'Its ' + list_item.alarm_hour + ':' + list_item.alarm_minute + '!',
                    subtitle: "This is the subtitle",
                },
                // DailyTriggerInput
                trigger: {
                    hour: list_item.alarm_hour,
                    minute: list_item.alarm_minute,
                    repeats: false
                }
            }));
        }
      });
      // rowSwipeAnimatedValues[`${list_item.id}`] = new Animated.Value(0);
    list = (await Notifications.getAllScheduledNotificationsAsync());
    return list;
}

async function removeAlarm(identifier, alarm_array){ // identifier should be a string
    // promise = (await Notifications.cancelScheduledNotificationAsync(identifier))
    Notifications.cancelScheduledNotificationAsync(identifier)
    console.log("cancelled", identifier)

    // Remove the alarm from the array
    for (var i = 0; i < alarm_array.length; i++) {
        if (alarm_array[i].name == identifier){
            alarm_array.splice(i, 1)
        }
    }
}

async function showAlarms(){
    list = (await Notifications.getAllScheduledNotificationsAsync());

    if (list.length == 0) {
        console.log("list.length == 0")
        // return list;
    }
    else {
        var print_list_new
        for (var i = 0; i < list.length; i++) {
            print_list_new += list[i].identifier
            print_list_new += " "
        }
        console.log("showAlarms:", print_list_new)
        return list;
    }
}

function AlarmsTable(){
    const [alarms, setAlarms] = useState([
        {name: 'First Alarm',   alarm_hour: 13, alarm_minute: 48, alarm_second: 0, switch: true,  id: "1"},
        {name: 'Second Alarm',  alarm_hour: 13, alarm_minute: 49, alarm_second: 0, switch: true,  id: "2"},
        {name: 'Third Alarm',   alarm_hour: 13, alarm_minute: 50, alarm_second: 0, switch: true,  id: "3"},
        {name: 'Fourth Alarm',  alarm_hour: 13, alarm_minute: 51, alarm_second: 0, switch: true,  id: "4"},
    ]);

    makeAlarms(alarms).then(list => {
      var print_list;
      for (var i = 0; i < alarms.length; i++) {
          print_list += list[i].identifier
          print_list += " "
      }
    })

    // removeAlarm(alarms[1].name, alarms)
    // removeAlarm("Second Alarm", alarms)

    showAlarms()

    const closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
          rowMap[rowKey].closeRow();
      }
    };

    const deleteRow = (rowMap, rowKey) => {
      closeRow(rowMap, rowKey);
      const newData = [...alarms];
      const prevIndex = alarms.findIndex(item => item.id === rowKey);
      newData.splice(prevIndex, 1);
      setAlarms(newData);
    };

    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
    };

    const onSwipeValueChange = swipeData => {
      const { key, value } = swipeData;
      // rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderItem = data => (
      <TouchableHighlight
          onPress={() => console.log('You touched me')}
          style={alarmStyles.rowFront}
          underlayColor={'#AAA'}
      >
          <View>
              <Text>I am {data.item.title} in a SwipeListView</Text>
          </View>
      </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
      <View style={alarmStyles.rowBack}>
          <TouchableOpacity
              style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnLeft]}
              onPress={() => closeRow(rowMap, data.item.id)}
          >
            <Text style={alarmStyles.backTextWhite}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnRight]}
              onPress={() => deleteRow(rowMap, data.item.id)}
          >
            <Animated.View style={[alarmStyles.trash]}>
                <Image
                    source={require('../../assets/trash.png')}
                    style={alarmStyles.trash}
                />
            </Animated.View>
          </TouchableOpacity>
      </View>
    );

    return(
        <View>
          <SwipeListView
            // <FlatList
                keyExtractor ={(item) => item.id} // specifying id as the key to prevent the key warning
                data = {alarms}
                renderItem={({ item }) => (
                <AlarmBanner>
                    <AlarmDetails title={item.name} hour={item.alarm_hour} minute={item.alarm_minute} second={item.alarm_second}/>
                    <SwitchExample/>
                    <Text>{item.switch}</Text>
                </AlarmBanner>
                )}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
                onSwipeValueChange={onSwipeValueChange}
            // />
        />
        </View>
    )
};

function TopBanner({ children }){
  return(
    <View style = {alarmStyles.topBanner}>{children}</View>
  )
};

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

    // This is the time picker, has two rows for the hour and minute
    const TimePicker = () => {
      const [time, setTime] = useState('');

      return (
        <DatePicker
          mode="time"
          minuteInterval={1}
          onTimeChange={selectedTime => setTime(selectedTime), console.log(time)}
          options={{
            backgroundColor: APPBACKGROUNDCOLOR,
            textDefaultColor: APPTEXTWHITE,
            selectedTextColor: '#fff',
            mainColor: APPTEXTRED,
            textFontSize:16
          }}
        />
        // <Text style={styles.logo}>time: {selectedTime}</Text>
        // </View>
      );
    };

    useEffect(() => { // useEffect is similar to componentDidMount and componentDidUpdate
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token)).catch(console.log(".catch"))

        // let the_subscription;
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log("addNotificationReceivedListener");
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("hi", response);
        });

        // return () => {
        //     Notifications.removeNotificationSubscription(notificationListener);
        //     Notifications.removeNotificationSubscription(responseListener);
        // };
    }, []);

    return (
        <View style={alarmStyles.container}>
        <TopBanner>
            <Text style={alarmStyles.pageTitle}>Alarms_Testing</Text>
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
            </Modal>*/}
        </TopBanner>

        <Button
          title="Send a notification now"
          onPress={async () => {
              await sendPushNotification(expoPushToken);
              console.log("Sending notification");
          }}
        />

        <View style={alarmStyles.scrollViewContainer}>
            {/* <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
            </View> */}
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
    // sound: "../sounds/piano1.wav",
    title: 'Hello Sidney',
    body: 'This is a notification for you!',
    data: { data: 'This is the data' },
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
        console.log("existingStatus:", existingStatus);
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
        console.log("token:", token);
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

