import React, { useState, useEffect, useRef, Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView, Modal, FlatList, AsyncStorage, Animated, Image, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from "@expo/vector-icons";

import SwitchExample, {switchValue} from '../../components/toggleSwitch';
import { APPBACKGROUNDCOLOR } from '../../style/constants';
import { appStyles } from '../../style/stylesheet';
import TimePicking from "../../components/timePicker";
import DatePicker from 'react-native-datepicker';

import * as firebase from "firebase";
import { db, auth } from "../../firebase/firebase";

function AlarmBanner({ children }){
    return(
        <View style = {styles.alarmBanner}>{children}</View>
    )
};

function AlarmDetails({title, hour, minute}){
    var new_hour = hour;
    if (hour > 12){
      new_hour = hour - 12
    }
    if (minute < 10) {
      return (
        <View style={styles.alarmDetails}>
            <Text style={styles.alarmTime}>{new_hour}:0{minute}</Text>
            <Text style={styles.alarmText}>{title}</Text>
        </View>
      )
    }
    else{
      return (
        <View style={styles.alarmDetails}>
            <Text style={styles.alarmTime}>{new_hour}:{minute}</Text>
            <Text style={styles.alarmText}>{title}</Text>
        </View>
      )
    }
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

async function addAlarm(name, alarm_hour, alarm_minute, id, alarm_array){
  // Add new alarm data to the alarm_array
  alarm_array.push(
    {name: name, alarm_hour: alarm_hour, alarm_minute: alarm_minute, switch: true, id: id}
  )

  console.log("New id:", id)
  
  // Use the new alarm data to schedule a notification
  promise = (await Notifications.scheduleNotificationAsync({
      identifier: name,
      content: {
          title: 'Its ' + alarm_hour + ':' + alarm_minute + '!',
          subtitle: "This is a new alarm",
      },
      // DailyTriggerInput
      trigger: {
          hour: alarm_hour,
          minute: alarm_minute,
          repeats: false
      }
  }));

  // return the list of all the scheduled notifications
  list = (await Notifications.getAllScheduledNotificationsAsync());
  return list;
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
        {name: 'First Alarm',   alarm_hour: 13, alarm_minute: 20, switch: true, id: '1'},
        {name: 'Second Alarm',  alarm_hour: 13, alarm_minute: 2, switch: true,  id: '2'},
        {name: 'Third Alarm',   alarm_hour: 13, alarm_minute: 18, switch: true,  id: '3'},
        {name: 'Fourth Alarm',  alarm_hour: 13, alarm_minute: 13, switch: true,  id: '4'},
    ]);

    makeAlarms(alarms)
      .then(list => {
        var print_list;
        for (var i = 0; i < alarms.length; i++) {
            print_list += list[i].identifier
            print_list += " "
        }
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({
            alarms: firebase.firestore.FieldValue.arrayUnion({
            alarms
        }),
      });
    });

    // console.log("length(alarms) + 1: ", alarms.length + 1)

    alarms.sort(sortByTime)

    // addAlarm("New Alarm", 10, 20, toString(alarms.length + 1), alarms)
    // addAlarm("New Alarm", 10, 20, alarms.length + 1, alarms)

    // removeAlarm(alarms[1].name, alarms)
    // removeAlarm("New Alarm", alarms)

    // console.log("Alarms array:", alarms)

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
      console.log("rowKey", rowKey)
      console.log("alarms[rowKey - 1].name", alarms[rowKey - 1].name)
      // removeAlarm(alarms[rowKey].name, alarms);
    };

    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
    };

    const onSwipeValueChange = swipeData => {
      const { key, value } = swipeData;
      // rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderHiddenItem = (data, rowMap) => (
      <View style={styles.rowBack}>
          <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => closeRow(rowMap, data.item.id)}
          >
            <Text style={styles.backTextWhite}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => deleteRow(rowMap, data.item.id)}
          >
            <View style={[styles.trash]}>
                <Image
                    source={require('../../assets/trash.png')}
                    style={styles.trash}
                />
            </View>
          </TouchableOpacity>
      </View>
    );

    function sortByTime(a, b) {
      const Ah = a.alarm_hour;
      const Bh = b.alarm_hour;
  
      const Am = a.alarm_minute;
      const Bm = b.alarm_minute;
  
      let comparison = 0;
      if (Ah > Bh) {
        comparison = 2;
      } 
      else if (Ah < Bh) {
        comparison = -2;
      } 
      else if (Ah == Bh) {
        console.log("same hour")
        if (Am > Bm) {
          comparison = 1;
        } else if (Am < Bm){
          comparison = -1;
        }
      }
      return comparison;
    }

    return(
        <View>
          <SwipeListView
            // <FlatList
                keyExtractor ={(item) => item.id} // specifying id as the key to prevent the key warning
                data = {alarms}
                renderItem={({ item }) => (
                <AlarmBanner>
                    <AlarmDetails title={item.name} hour={item.alarm_hour} minute={item.alarm_minute}/>
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

        {/* <Button
            title="+"
            onPress={async () => {
              addAlarm("New Alarm", 10, 49, alarms.length + 1, alarms);
              // alarms.sort(sortByTime);
              // showAlarms();
            }}
        /> */}

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
    const [alarmTime, setAlarmTime] = useState();
    const [alarmText, setAlarmText] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();

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

    // var TimePicker = new TimePicking();
    // console.log("typeof timePicker", typeof timePicker)

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
                {/* <Text style={styles.Text}>DateTimePicker will go here</Text> */}
                <Text style={styles.pageTitle}> Set a new alarm </Text>

                  <DatePicker
                    style={{width: 200, color: "black"}}
                    date= {alarmTime}
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    minuteInterval={1}
                    onDateChange={(time) => {setAlarmTime(time)}}
                    customStyles={{
                      dateInput:{
                        color: "white"
                      },
                      btnTextConfirm:{
                        color: "lightgreen"
                      },
                      btnCancel:{
                        color: "red"
                      }
                    }}
                    onPressMask={console.log("Pressed")}
                    // hideText={true}
                    hideText={false}
                    allowFontScaling={true}
                    // useNativeDriver: true
                  />

                <View style={styles.inputView}>
                  <TextInput
                    style={styles.inputText}
                    placeholder="Alarm title..."
                    placeholderTextColor="#003f5c"
                    onChangeText={(text) => {setAlarmText(text)}}
                  />
                </View>

                <Text style={styles.inputText}> time: {alarmTime}</Text>
                <Text style={styles.inputText}> title: {alarmText}</Text>

                <Button
                  title="Set Alarm"
                  onPress={async () => 
                    setModalOpen(false)
                    // addAlarm(alarmText, 10, 49, alarms.length + 1, alarms)
                  }
                />

            </View>
            </Modal>
        </TopBanner>

        {/* <Button
            title="Send a notification now"
            onPress={async () => {
                await sendPushNotification(expoPushToken);
                console.log("Sending notification");
            }}
        /> */}

        {/* <TimePicking/>
        <Text style={styles.Text}>TimePicking time: {TimePicker.state.time}</Text> */}
      
        <View style={styles.scrollViewContainer}>
            {/* <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
            </View> */}

        <AlarmsTable/>

        {/* <Button
            title="Refresh alarms"
            onPress={async () => {
                console.log("Loading alarms");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
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
    // backgroundColor: "white",
    backgroundColor: APPBACKGROUNDCOLOR,
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
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },

  backTextWhite: {
    color: '#FFF',
  },

  rowBack: {
      alignItems: 'center',
      // backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
      width: "95%"
  },

  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnLeft: {
      backgroundColor: 'blue',
      right: 75,
      marginTop: 0,
      marginBottom: 10,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
  },
  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
      marginTop: 0,
      marginBottom: 10,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
  },
  trash: {
      height: 25,
      width: 25,
  },
})
