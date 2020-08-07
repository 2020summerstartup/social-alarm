// This is the most updated alarms page file as of 8/4/20

// Import statements
import React, { Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, Modal, AsyncStorage, Animated, Image, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Chevron from './downChevron';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from "@expo/vector-icons";

import SwitchExample, {switchValue} from '../../components/toggleSwitch';
import { APPBACKGROUNDCOLOR, APPTEXTBLUE, APPTEXTRED } from '../../style/constants';
import { appStyles } from '../../style/stylesheet';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';


//import getStyleSheet from '../../style/theme';

import Firebase from "../../firebase/firebase";


import * as firebase from "firebase";

import { db, auth } from "../../firebase/firebase";

const moment = require("moment");

// TopBanner formats the title and modal button along the top of the screen
function TopBanner({ children }){
  return(
    <View style = {styles.topBanner}>{children}</View>
  )
};

// An AlarmBanner is one alarm displayed in the list of alarms
function AlarmBanner({ children, color }){
  return(
      <View style={[styles.alarmBanner, {backgroundColor: color}]}>
        {children}
      </View>
  )
};

// AlarmDetails specifies the layout within an AlarmBanner 
function AlarmDetails({title, hour, minute}){
  
  var ampm;

  // For display purposes: A bit of logic to set am/pm, set hour 0 = 12, add 0 in front of mins that are <10
  if (hour < 12){
    ampm = " am";
  }
  if (hour > 12){
    hour = hour - 12;
    ampm = " pm";
  }
  if (hour == 12){
    ampm = " pm"
  }
  if (hour == 0){
    hour = "12";
    ampm = " am"
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  return (
      <View style={styles.alarmDetails}>
          <Text style={styles.alarmTime}>{hour}:{minute}{ampm}</Text>
          <Text style={styles.alarmText}>{title}</Text>
      </View>
  )
};

// Alarms is the main class
export default class Alarms extends Component {
    constructor(props) {
        super(props);
        this.AlarmsTable = this.AlarmsTable.bind(this); // This is the magical line that gets rid of "this" errors inside AlarmsTable
        this.updateFirebaseGroupsDoc = this.updateFirebaseGroupsDoc.bind(this);
        this.getFirebaseUsersAlarmsFromGroupsDocs = this.getFirebaseUsersAlarmsFromGroupsDocs.bind(this);
        this.addAlarm = this.addAlarm.bind(this);
        
        // Defining state variables that are used throughout class functions
        this.state = {
            alarms: [],
            newAlarmModalOpen: false,
            groupPickerModalOpen: false,
            expoPushToken: "",
            notification: false,
            newAlarmTime: 0,
            newAlarmHour: 0,
            newAlarmMinute: 0,
            newAlarmText:"",
            notificationListener: "",
            responseListener: "",
            newGroupName: "",
            groupsArray: [],
            groupIdClicked: "",
            singleAlarm: {name: "", alarm_hour: null, alarm_minute: null, switch: null,  key: ""},
            openRow: null,
            currentMaxKey: 0,
            listOfKeys: [],
        }
    }

    // Updates the local alarms array with user's unique alarms that are stored in the user's doc in Firebase
    getFirebaseUsersAlarmsFromUsersDoc(){
      db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Get the groups from the user's doc - store in some state to display
          const alarmsData = [];
          for (var i = 0; i < doc.data().alarms.length; i++) {
            alarmsData.push({
              alarm_hour: doc.data().alarms[i].alarm_hour,
              alarm_minute: doc.data().alarms[i].alarm_minute,
              key: doc.data().alarms[i].key,
              name: doc.data().alarms[i].name,
              switch: doc.data().alarms[i].switch,
              color: doc.data().alarms[i].color
            });
          }
          // Update the state with the alarms
          this.setState({ alarms: alarmsData });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    /*Updates the local alarms array with user's group alarms that are stored in all corresponding groups docs in Firebase*/
    getFirebaseUsersAlarmsFromGroupsDocs(){
      // Gets the list of groups that the user is in
      db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // get the groups from the user's doc - store in some state to display
          const groupsData = [];
          for (var i = 0; i < doc.data().groups.length; i++) {
            groupsData.push({
              name: doc.data().groups[i].name,
              id: doc.data().groups[i].id,
              key: i,
            });
          }
          // Update the state with the user's groups
          this.setState({ groupsArray: groupsData });

          // Loops through all the documents corresponding to the user's groups and adds the alarms to state
          for (var i = 0; i < groupsData.length; i++){
            db.collection("groups")
            .doc(groupsData[i].id)
            .get()
            .then((doc) => {
              if (doc.exists) {
                // get the groups from the user's doc - store in some state to display
                const alarmsData = [];
                for (var i = 0; i < doc.data().alarms.length; i++) {
                  alarmsData.push({
                    alarm_hour: doc.data().alarms[i].alarm_hour,
                    alarm_minute: doc.data().alarms[i].alarm_minute,
                    key: doc.data().alarms[i].key,
                    name: doc.data().alarms[i].name,
                    switch: doc.data().alarms[i].switch,
                    color: doc.data().alarms[i].color
                  });
                }
                alarmList = this.state.alarms;
                Array.prototype.push.apply(alarmList, alarmsData);
              }
              // Update the state with the group alarms
              this.setState({ alarms: alarmList });
            })
            .catch(function (error) {
              console.log(error);
            });
          }
        }
      })
    }

    /*Uses the list of alarms to set the push notifications*/
    async makeAlarms(alarm_array){
      console.log("makeAlarms")
      alarm_array.forEach(async(list_item) => {
          if (list_item.switch == true){
              promise = (await Notifications.scheduleNotificationAsync({
                  identifier: list_item.name,
                  content: {
                      title: list_item.name,
                      // Add feature: custom subtitle
                      // subtitle: 'Its ' + list_item.alarm_hour + ':' + list_item.alarm_minute + '!',
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

      // list is the promise return
      list = (await Notifications.getAllScheduledNotificationsAsync());
      return list;
    };

    /*Cancels the specified alarm's push notification and removes the specified alarm from the alarm array*/
    async removeAlarm(identifier, alarm_array){ // identifier should be a string
      Notifications.cancelScheduledNotificationAsync(identifier)
      console.log("cancelled", identifier)
  
      // Remove the alarm from the array
      for (var i = 0; i < alarm_array.length; i++) {
          if (alarm_array[i].name == identifier){
              alarm_array.splice(i, 1)
          }
      }

      this.setState({alarms: alarm_array}) //, () => console.log("this.state.alarms from removeAlarm:", this.state.alarms));
    };

    
    /*Cancels all alarm push notification and empties the alarm array*/
    removeAllAlarms(){
      Notifications.cancelAllScheduledNotificationsAsync()
      // console.log("Cancelled All Scheduled Notifications Async")
      this.setState({ alarms: [] }); 
    };

    /*Adds an alarm to the alarm array, sets the alarm push notification, and updates the user's doc in Firebase*/
    async addAlarm(name, alarm_hour, alarm_minute, key, color, alarm_array) {
            
      // Add new alarm data to the local alarm_array to display
      alarm_array.push(
        {name: name, alarm_hour: alarm_hour, alarm_minute: alarm_minute, switch: true, key: key, color: color}
      )
      
      // Sort the alarm array by time after new alarm is added
      alarm_array.sort(this.sortByTime)
      
      // Use the new alarm data to schedule a notification
      promise = (await Notifications.scheduleNotificationAsync({
          identifier: name,
          content: {
              title: name,
              subtitle: 'Its ' + alarm_hour + ':' + alarm_minute + '!',
          },
          // DailyTriggerInput
          trigger: {
              hour: alarm_hour,
              minute: alarm_minute,
              repeats: false
          }
      }));

      // Update user's document in Firebase with the new alarm
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({
          alarms: Firebase.firestore.FieldValue.arrayUnion({
            name: name, 
            alarm_hour: alarm_hour, 
            alarm_minute: alarm_minute, 
            switch: true, 
            key: key,
            color: color
          }),
      });

      // Increment the currentMaxKey now that we've added an alarm with key: currentMaxKey + 1
      await this.incrementCurrentMaxKey();
      console.log("currentMaxKey after increment:", this.state.currentMaxKey)
      
      console.log("Updated users doc in firebase with one alarm")
      
      // Return the list of all the scheduled notifications
      list = (await Notifications.getAllScheduledNotificationsAsync());
      return list;
    };

    /*For debugging: Prints all the scheduled push notifications to the console*/
    async showAlarms(){
      list = (await Notifications.getAllScheduledNotificationsAsync());
  
      if (list.length == 0) {
          console.log("list.length == 0")
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

    /*Updates state with listOfKeys*/
    listofKeys = async () => {
      var list = []
      for (var i = 0; i < this.state.alarms.length; i++) {
        list.push(this.state.alarms[i].key)
      }
      // Updates state
      this.setState( {listOfKeys: list}) // , () => {console.log("listOfKeys:", this.state.listOfKeys); })
    }

    /*Updates the group's document in Firebase*/
    updateFirebaseGroupsDoc = async () => {
      console.log("Updating", this.state.groupIdClicked, "in firebase")

      const promise = await this.updateCurrentMaxKey();
      console.log("currentMaxKey:", this.state.currentMaxKey)
      await(this.listofKeys())
      // console.log("listOfKeys:", this.state.listOfKeys);

      for (var i = 0; i < this.state.currentMaxKey + 1; i++) {
        if (this.state.listOfKeys.includes(i)){
          for (var j = 0; j < this.state.alarms.length; j++) {
            if (this.state.alarms[j].key == this.state.openRow){
              var newAlarm = {
                name: this.state.alarms[j].name, 
                alarm_hour: this.state.alarms[j].alarm_hour,
                alarm_minute: this.state.alarms[j].alarm_minute, 
                switch: this.state.alarms[j].switch, 
                key: this.state.alarms[j].key,
                color: this.state.alarms[j].color
              }
            }
          }
        }
      }
      
      await(this.setState( {singleAlarm: newAlarm} ))

      db.collection("groups")
        .doc(this.state.groupIdClicked)
        .get()
        .then((doc) => {
          if (doc.exists) {
            var maxKey = 0
            for (var i = 0; i < doc.data().alarms.length; i++){
              var keySplitArray = doc.data().alarms[i].key.split(":")
              if (keySplitArray[1] > maxKey){
                maxKey = keySplitArray[1]
              }
            }
            maxKey = Number(maxKey) + 1
            db.collection("groups")
              .doc(this.state.groupIdClicked)
              .update({

                alarms: Firebase.firestore.FieldValue.arrayUnion({
                  // alarms: this.state.singleAlarm

                  name: this.state.singleAlarm.name, 
                  alarm_hour: this.state.singleAlarm.alarm_hour,
                  alarm_minute: this.state.singleAlarm.alarm_minute, 
                  switch: this.state.singleAlarm.switch, 
                  key: this.state.groupIdClicked + ":" + (maxKey),
                  color: this.state.singleAlarm.color, 
                }),
            })
          }
      });
      
      // Remove the alarm from the user's doc in firebase (so the alarm is only listed in the group's doc)
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({
          alarms: Firebase.firestore.FieldValue.arrayRemove({
            name: this.state.singleAlarm.name, 
            alarm_hour: this.state.singleAlarm.alarm_hour,
            alarm_minute: this.state.singleAlarm.alarm_minute, 
            switch: this.state.singleAlarm.switch, 
            key: this.state.singleAlarm.key,
            color: this.state.singleAlarm.color
          }),
      });

      // Close the picker modal
      this.setState({ groupPickerModalOpen: false })
    }

    /*Updates state with the user's groups*/
    getFirebaseUsersGroups() {
      db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // get the groups from the user's doc - store in some state to display
          const groupsData = [];
          for (var i = 0; i < doc.data().groups.length; i++) {
            groupsData.push({
              name: doc.data().groups[i].name,
              id: doc.data().groups[i].id,
              key: i,
            });
          }

          // Adds label and value keys to the groupsArray for the picker to work
          groupsData.forEach( element => {
            element.label = element.name;
            element.value = element.id;
            element.key = element.id;
          })

          // Update state
          this.setState({ groupsArray: groupsData });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    /*Splits the time string from the time picker into hour and minute and updates state*/
    splitTime(){
      var variable = this.state.newAlarmTime
      var splitArray
      splitArray = variable.split(":") // splits the string at the ":" character
      this.setState( {newAlarmHour: Number(splitArray[0]) })
      this.setState( {newAlarmMinute: Number(splitArray[1]) })
    }

    /*Displays all the alarm banners*/
    AlarmsTable(props){

      // Closes row
      const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
      };
  
      // Deletes alarm corresponding to touched row from local array and from firebase
      const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...props.alarms];
        const prevIndex = props.alarms.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        this.setState({ alarms: newData });

        /* The alarm data is either in the user's doc or the group's doc. 
        The alarm data does not exist in both docs simultaneously
        but this function deletes it from both docs so that the data gets 
        deleted without having to figure out where the alarm data is */

        // Remove the alarm from the user's doc in firebase
        db.collection("users")
          .doc(auth.currentUser.email)
          .update({
            alarms: firebase.firestore.FieldValue.arrayRemove({
              name: props.alarms[prevIndex].name,
              alarm_hour: props.alarms[prevIndex].alarm_hour,
              alarm_minute: props.alarms[prevIndex].alarm_minute, 
              switch: props.alarms[prevIndex].switch, 
              key: props.alarms[prevIndex].key,
              color: props.alarms[prevIndex].color
            }),
          });

        // Remove the alarm from the groups's doc in firebase
        var groupIDSplitArray = props.alarms[prevIndex].key.split(":")
        db.collection("groups")
          .doc(groupIDSplitArray[0])
          .update({
            alarms: firebase.firestore.FieldValue.arrayRemove({
              name: props.alarms[prevIndex].name,
              alarm_hour: props.alarms[prevIndex].alarm_hour,
              alarm_minute: props.alarms[prevIndex].alarm_minute, 
              switch: props.alarms[prevIndex].switch, 
              key: props.alarms[prevIndex].key,
              color: props.alarms[prevIndex].color
            }),
          });
        
        // Remove the alarm from the local array that displays
        this.removeAlarm(props.alarms[prevIndex].name, props.alarms);
      };
  
      // Updates state with which row(alarm) was pressed and opened
      onRowDidOpen = async(rowKey) => {
        // console.log('This row opened rowKey', rowKey);
        const prevIndex = props.alarms.findIndex(item => item.key === rowKey);
        // console.log('This row opened prevIndex', prevIndex);
        promise = await(this.setState({ openRow: Number(rowKey)}));
      };
  
      const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
      };
  
      // Renders the buttons behind the alarm banners
      const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>

            {/*+Groups button */}
            <TouchableOpacity
                style={[styles.backLeftBtn]}
                onPress={() => 
                  this.setState({ groupPickerModalOpen: true })}
            >
              <Text style={styles.backTextWhite}>+Group</Text>
            </TouchableOpacity>

            {/*Edit button */}
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnCenter]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
              <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
  
            {/*Trash button */}
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
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
          {/* Renders the alarm banners as swipable components */}
          <SwipeListView
                // These are all specified by SwipeListView
                keyExtractor ={(item) => item.id} // specifying id as the key to prevent the key warning
                data = {props.alarms}
                renderItem={({ item }) => (
                  <View>
                    <AlarmBanner color={item.color}>
                        <AlarmDetails title={item.name} hour={item.alarm_hour} minute={item.alarm_minute}/>
                        <SwitchExample/>
                    </AlarmBanner>
                  </View>
                )}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={90}
                rightOpenValue={-145}
                previewRowKey={'1'}
                previewOpenValue={-50}
                previewOpenDelay={500}
                onRowDidOpen={onRowDidOpen}
                onSwipeValueChange={onSwipeValueChange}
        />
        </View>
      )
    };

    // Sorts the alarms for output in ascending order by time
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
        // console.log("same hour")
        if (Am > Bm) {
          comparison = 1;
        } else if (Am < Bm){
          comparison = -1;
        }
      }
      return comparison;
    };

    /*Sets up push notifications permissions*/
    async registerForPushNotificationsAsync() {
      let token;
      if (Constants.isDevice) {
          // Check for existing permissions
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          // console.log("existingStatus:", existingStatus);
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
          // console.log("token:", token);
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

    /*Returns a promise when initialization functions having to do with Firebase and state have run*/
    getFirebase = () => new Promise(
      (resolve) => {
        // get the user's personal alarms
        this.getFirebaseUsersAlarmsFromUsersDoc();

        // get the user's group alarms
        this.getFirebaseUsersAlarmsFromGroupsDocs();

        // get the users groups
        this.getFirebaseUsersGroups();

        this.updateCurrentMaxKey();

        setTimeout(() => resolve(1234), 1000)
      }
    )

    /*Updates the currentMaxKey state*/
    updateCurrentMaxKey(){
      var maxKey = this.state.currentMaxKey

      db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          db.collection("users")
            .doc(auth.currentUser.email)
            for (var i = 0; i < doc.data().alarms.length; i++){
              if (doc.data().alarms[i].key > maxKey){
                maxKey = doc.data().alarms[i].key
              }
            }
        }
        // Update state
        this.setState({currentMaxKey: maxKey});
      })
    }

    /*Returns a promise when the currentMaxKey is incremented by 1*/
    incrementCurrentMaxKey = () => new Promise(
      (resolve) => {
        newMaxKey = this.state.currentMaxKey;
        newMaxKey = newMaxKey + 1; 
        this.setState({currentMaxKey: newMaxKey})
        setTimeout(() => resolve(1234), 1000)
      }
    )

    /*Runs when page refreshes: Initialization*/
    componentDidMount = async () => {
      // Removes all alarms
      this.removeAllAlarms();

      // Waits for Firebase related initialization functions to run
      const promise = await this.getFirebase();

      // Uses alarms array to make the alarms
      this.makeAlarms(this.state.alarms);

      // Sorts the alarms for output in ascending order by time
      this.state.alarms.sort(this.sortByTime)

      // Registers for push notifications and sets the user's Expo push notification token
      this.registerForPushNotificationsAsync().then(token => this.setState({ expoPushToken: token }))//.catch(console.log(".catch"))

      // let the_subscription;
      this.state.notificationListener = Notifications.addNotificationReceivedListener(notification => this.setState({ notification: notification}))

      // this.state.responseListener = Notifications.addNotificationResponseReceivedListener(response => {console.log("Response:", response)});
    
      return () => {
        Notifications.removeNotificationSubscription(this.state.notificationListener);
        Notifications.removeNotificationSubscription(this.state.responseListener);
      };
    };

    render(){
      return(
        <View style={styles.container}>
          <TopBanner>
              <Text style={styles.pageTitle}>Alarms</Text>

              {/*BEGINNING OF MODAL FOR ADD ALARM */}
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
                  <Text style={appStyles.logo}> Set a new alarm </Text>

                    <DatePicker
                      style={{height: 75, width: 200, color: "black"}}
                      date= {moment().format("LTS")} // Starts timepicker at current time (except always AM?)
                      mode="time"
                      format="HH:mm"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      showIcon={false}
                      minuteInterval={1}
                      onDateChange={(time) => this.setState({ newAlarmTime: time })}
                      // customStyles={{
                      //   // dateInput:{
                      //   //   color: "black"
                      //   // },
                      //   btnTextConfirm:{
                      //     color: "lightgreen"
                      //   },
                      //   btnCancel:{
                      //     color: "red"
                      //   }
                      // }}
                    />

                  <View style={styles.inputView}>
                    <TextInput
                      style={styles.inputText}
                      placeholder="Alarm title..."
                      placeholderTextColor="#003f5c"
                      onChangeText={(text) => this.setState({newAlarmText: text})}
                    />
                  </View>

                  {/*
                  <Button
                    title="Split the time"
                    onPress={ async() =>
                      this.splitTime()
                    }
                  />

                  {/* Useful print statements on modal page for debugging */}
                  {/* <Text style={styles.inputText}> time:{this.state.newAlarmTime} </Text>
                  <Text style={styles.inputText}> hour:{this.state.newAlarmHour} </Text>
                  <Text style={styles.inputText}> minute:{this.state.newAlarmMinute}</Text>
                  <Text style={styles.inputText}> title:{this.state.newAlarmText}</Text> */}

                  <Button style={styles.button}
                  title="Set Alarm"
                  onPress={ async() =>
                    this.addAlarm(this.state.newAlarmText, this.state.newAlarmHour, this.state.newAlarmMinute, this.state.currentMaxKey + 1, "white", this.state.alarms)
                    .then(this.setState({ newAlarmModalOpen: false }))
                    // Add color wheel to specify color (rn hardcoded "white")
                  }
                  />

                  {/* Additional button to close the modal */}
                  <Button
                    title="Cancel"
                    onPress={ async() =>
                      this.setState({ newAlarmModalOpen: false })
                    }
                  />

              </View>
              </Modal>
              {/*END OF MODAL FOR ADD ALARM */}

          </TopBanner>
        
          <View style={styles.scrollViewContainer}>
              {/* Useful print statements on screen for debugging */}
              {/* <Text>Your expo push token: {expoPushToken}</Text>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>Title: {notification && notification.request.content.title} </Text>
              <Text>Body: {notification && notification.request.content.body}</Text>
              <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
              </View> */}

            <this.AlarmsTable alarms={this.state.alarms}/>

          </View>

          {/* Useful button during testing */}
          <Button
            title="Print user email to console"
            onPress={ async() =>
              console.log("auth.currentUser.email:", auth.currentUser.email)
            }
          />

          {/* BEGINNING OF MODAL FOR GROUP PICKER */}
          <Modal visible={this.state.groupPickerModalOpen} animationType="slide">
          <View style={appStyles.modalContainer}>
              <MaterialIcons
              name="close"
              size={24}
              style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
              onPress={() => this.setState({ groupPickerModalOpen: false })}
              />
              <Text style={appStyles.logo}> Select a group </Text>

              {/* https://github.com/lawnstarter/react-native-picker-select */} 
              <RNPickerSelect
                onValueChange={(value) => this.setState({ groupIdClicked: value })}
                items={this.state.groupsArray}

                // Object to overide the default text placeholder for the PickerSelect
                placeholder={{label: 'Click here to select a group', value: "0", key: "0"}}
                style={
                  { fontWeight: 'normal',
                    color: 'red',
                    placeholder: {
                      color: "#fb5b5a",
                      fontSize: 20,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    inputIOS: {
                      color: APPTEXTBLUE,
                      fontSize: 20,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  }
                }
                doneText={"Select"}
                Icon={() => {return <Chevron size={1.5} color="gray" />;}}
              />

              <Text></Text>

              <TouchableOpacity
                style={{ ...appStyles.loginBtn, ...{ marginTop: 10 } }}
                onPress={async() =>
                  this.updateFirebaseGroupsDoc()
                }
              >
                <Text style={appStyles.buttonText}> add alarm to group</Text>
              </TouchableOpacity>

              </View>
          </Modal>
          {/*END OF MODAL FOR GROUP PICKER */}

        </View>
      );
    };
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

// Styles (to do: incorporate global styles sheet)
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
    backgroundColor: APPBACKGROUNDCOLOR,
    height: 110,
    paddingTop: 25,
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
    paddingTop:0,
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    alignItems: "center",
  },

  inputText:{
    padding: 20,
    height: 50,
    color:"#ffffff",
    fontSize: 16
  },

  inputView:{
    width:"75%",
    backgroundColor:APPBACKGROUNDCOLOR,
    borderColor:"black",
    borderWidth: 1,
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
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: "95%",
    borderRadius: 15
  },

  alarmBannerColor:{
    backgroundColor: "lightgreen",
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
    backgroundColor:"#465881",
    alignItems: 'center',
    justifyContent:"center",
    borderRadius: 30,
    marginBottom: 20,
    padding:20
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
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
      width: "95%"
  },

  backLeftBtn:{
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 90,
    backgroundColor: 'green',
    left: 25,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },

  backRightBtnCenter: {
      backgroundColor: 'blue',
      right: 75,
      marginTop: 0,
      marginBottom: 10,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
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
