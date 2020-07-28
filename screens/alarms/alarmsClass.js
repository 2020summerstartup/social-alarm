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

// function TopBanner({ children }){
//   return(
//     <View style = {styles.topBanner}>{children}</View>
//   )
// };

class TopBanner extends Component {
  TopBanner({ children }){
        return(<View style = {styles.topBanner}>{children}</View>)
    };
}

export default class Alarms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alarms: [
                {name: 'First Alarm',   alarm_hour: 13, alarm_minute: 48, switch: true,  id: "1"},
                {name: 'Second Alarm',  alarm_hour: 13, alarm_minute: 49, switch: true,  id: "2"},
                {name: 'Third Alarm',   alarm_hour: 13, alarm_minute: 50, switch: true,  id: "3"},
                {name: 'Fourth Alarm',  alarm_hour: 13, alarm_minute: 51, switch: true,  id: "4"},
            ],
            newAlarmModalOpen: false,
            expoPushToken: "",
            notification: false,
            newAlarmTime: "",
            newAlarmText:"",
            notificationListener: "",
            responseListener: ""
        }
    }

    // TopBanner({ children }){
    //   // render() {
    //     return(<View style = {styles.topBanner}>{children}</View>)
    //   // }
    // };

    AlarmBanner({ children }){
        return(
            <View style = {styles.alarmBanner}>{children}</View>
        )
    };

    AlarmDetails({title, hour, minute}){
        return (
            <View style={styles.alarmDetails}>
                <Text style={styles.alarmTime}>{hour}:{minute}</Text>
                <Text style={styles.alarmText}>{title}</Text>
            </View>
        )
    };

    async makeAlarms(alarm_array){
      alarm_array.forEach(async(list_item) => {
          if (list_item.switch == true){
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
      list = (await Notifications.getAllScheduledNotificationsAsync());
      return list;
    };

    async removeAlarm(identifier, alarm_array){ // identifier should be a string
      // promise = (await Notifications.cancelScheduledNotificationAsync(identifier))
      Notifications.cancelScheduledNotificationAsync(identifier)
      console.log("cancelled", identifier)
  
      // Remove the alarm from the array
      for (var i = 0; i < alarm_array.length; i++) {
          if (alarm_array[i].name == identifier){
              alarm_array.splice(i, 1)
          }
      }
    };

    async addAlarm(name, alarm_hour, alarm_minute, id, alarm_array){
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
    };

    async showAlarms(){
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

    AlarmsTable(){
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

      return(
        <View>
          <SwipeListView
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
        />
        </View>
      )
    };

    sortByTime(a, b) {
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
    };

    // TopBanner({ children }){
    //   return(
    //     <View style = {styles.topBanner}>{children}</View>
    //   )
    // };

    componentDidMount(){
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token)).catch(console.log(".catch"))

      // let the_subscription;
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log("hi", response);
      });
    };

    // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  async sendPushNotification(expoPushToken) {
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

  async registerForPushNotificationsAsync() {
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

    render(){
      console.log("Initialize alarms")

      return(
        <View style={styles.container}>
          <TopBanner>
              <Text style={styles.pageTitle}>Alarms_Testing</Text>
              <MaterialIcons
                  name="add"
                  size={24}
                  style={appStyles.modalToggle}
                  onPress={() => this.setState({ newAlarmModalOpen: true })}
              />
              <Modal visible={this.state.newAlarmModalOpen} animationType="slide">
              <View style={appStyles.modalContainer}>
                  <MaterialIcons
                  name="close"
                  size={24}
                  style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                  onPress={() => this.setState({ newAlarmModalOpen: false })}
                  />
                  {/* <Text style={styles.Text}>DateTimePicker will go here</Text> */}
                  <Text style={styles.pageTitle}> Set a new alarm </Text>

                    <DatePicker
                      style={{width: 200, color: "black"}}
                      date= {this.state.newAlarmTime}
                      mode="time"
                      format="HH:mm"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      minuteInterval={1}
                      onDateChange={(time) => this.setState({ newAlarmTime: time })}
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

                  <Text style={styles.inputText}> time: {this.state.newAlarmTime}</Text>
                  <Text style={styles.inputText}> title: {this.state.newAlarmText}</Text>

                  <Button
                    title="Set Alarm"
                    onPress={async() => 
                      this.setState({ newAlarmModalOpen: false })
                      // addAlarm("New Alarm", 10, 49, alarms.length + 1, alarms)
                    }
                  />

              </View>
              </Modal>
          </TopBanner>
        
          <View style={styles.scrollViewContainer}>
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
    };
}

// Keep adding starting at line 295 to line 493 of alarms.js

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

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
