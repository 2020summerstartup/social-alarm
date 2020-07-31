// This is the most updated alarms page file as of 7/28/20
 
import React, { Component } from 'react';
import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, Modal, AsyncStorage, Animated, Image, TouchableHighlight } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Chevron from './downChevron';

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from "@expo/vector-icons";

import SwitchExample, {switchValue} from '../../components/toggleSwitch';
import { APPBACKGROUNDCOLOR } from '../../style/constants';
import { appStyles } from '../../style/stylesheet';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

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
function AlarmBanner({ children }){
  return(
      <View style = {styles.alarmBanner}>{children}</View>
  )
};

// AlarmDetails specifies the layout within an AlarmBanner 
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

export default class Alarms extends Component {
    constructor(props) {
        super(props);
        this.AlarmsTable = this.AlarmsTable.bind(this); // This is the magical line that gets rid of "this" errors inside AlarmsTable
        this.updateFirebaseGroupsDoc = this.updateFirebaseGroupsDoc.bind(this);
        this.setMaxKey = this.setMaxKey.bind(this);
        this.addAlarm = this.addAlarm.bind(this);
        
        this.state = {
            // alarms: [
            //     {name: 'First Alarm',   alarm_hour: 13, alarm_minute: 36, switch: true,  key: 1},
            //     {name: 'Second Alarm',  alarm_hour: 13, alarm_minute: 35, switch: true,  key: 2},
            //     {name: 'Third Alarm',   alarm_hour: 13, alarm_minute: 38, switch: true,  key: 3},
            //     {name: 'Fifth Alarm',  alarm_hour: 13, alarm_minute: 37, switch: true,  key: 5},
            // ],
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
            singleAlarm: {name: '', alarm_hour: null, alarm_minute: null, switch: null,  key: ""},
            openRow: null,
            currentMaxKey: 0,
            listOfKeys: []
        }
    }

    async makeAlarms(alarm_array){
      alarm_array.forEach(async(list_item) => {
          if (list_item.switch == true){
              promise = (await Notifications.scheduleNotificationAsync({
                  identifier: list_item.name,
                  content: {
                      title: list_item.name,
                      subtitle: 'Its ' + list_item.alarm_hour + ':' + list_item.alarm_minute + '!',
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

      list.forEach(element => {
        // console.log("Element.trigger:", element.trigger.dateComponents.hour, element.trigger.dateComponents.minute)
      })
      // console.log("This is the list", list)
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

      this.setState({alarms: alarm_array})
      // console.log("this.state.alarms:", this.state.alarms)

    };

    removeAllAlarms(){
      // promise = (await Notifications.cancelScheduledNotificationAsync(identifier))
      Notifications.cancelAllScheduledNotificationsAsync()
      console.log("Cancelled All Scheduled Notifications Async")
  
      this.setState({ alarms: [] }); // empty the alarms array
    };

    async addAlarm(name, alarm_hour, alarm_minute, key, alarm_array) {
      // Add new alarm data to the alarm_array
      alarm_array.push(
        {name: name, alarm_hour: alarm_hour, alarm_minute: alarm_minute, switch: true, key: key}
      )

      // promise = await(this.setState(
      //   {alarms: [this.state.alarms] + [{name: name, alarm_hour: alarm_hour, alarm_minute: alarm_minute, switch: true, key: key}]
      //   }))

      console.log("this.state.alarms:", this.state.alarms)
    
      promise = await(this.setState( {currentMaxKey: key} ))

      console.log("New key:", key)
      console.log("currentMaxKey:", this.state.currentMaxKey)
      
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

    updateFirebaseUsersDoc(){
      db.collection("users")
        .doc(auth.currentUser.email)
        .update({
            alarms: firebase.firestore.FieldValue.arrayUnion({
            // alarms : "test"
            alarms: this.state.alarms
        }),
      });
    }

    setMaxKey = async () => {
      var maxKey = 0
      for (var i = 0; i < this.state.alarms.length; i++) {
        if (this.state.alarms[i].key > this.state.currentMaxKey){
          maxKey = this.state.alarms[i].key
          promise = await(this.setState( {currentMaxKey: maxKey}))
        }
        // console.log("The currentMaxKey is", this.state.currentMaxKey);
      }
    }

    listofKeys = async () => {
      var list = []
      for (var i = 0; i < this.state.alarms.length; i++) {
        list.push(this.state.alarms[i].key)
      }
      this.setState( {listOfKeys: list}) // , () => {console.log("listOfKeys:", this.state.listOfKeys); })
    }

    updateFirebaseGroupsDoc = async () => {
      console.log("Updating", this.state.groupIdClicked, "in firebase")

      await(this.setMaxKey())
      await(this.listofKeys())
      console.log("listOfKeys:", this.state.listOfKeys);

      for (var i = 0; i < this.state.currentMaxKey + 1; i++) {
        if (this.state.listOfKeys.includes(i)){
          console.log("Includes")
          for (var j = 0; j < this.state.alarms.length; j++) {
            if (this.state.alarms[j].key == this.state.openRow){
              console.log("this.state.alarms[i].key == this.state.openRow")
              var newAlarm = {
                name: this.state.alarms[j].name, 
                alarm_hour: this.state.alarms[j].alarm_hour,
                alarm_minute: this.state.alarms[j].alarm_minute, 
                switch: this.state.alarms[j].switch, 
                key: this.state.alarms[j].key
              }
            }
          }
        }
      }
      
      console.log("newAlarm:", newAlarm)
      await(this.setState( {singleAlarm: newAlarm} ))
      console.log("singleAlarm:", this.state.singleAlarm)

      db.collection("groups")
        .doc(this.state.groupIdClicked)
        .update({
            alarms: firebase.firestore.FieldValue.arrayUnion({
            alarms: this.state.singleAlarm
        }),
      });
      this.setState({ groupPickerModalOpen: false })
    }

    getFirebaseUsersGroups(){
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
          this.setState({ groupsArray: groupsData });
          console.log("The user's groups:", this.state.groupsArray)

          // Adds label and value keys to the groupsArray for the picker to work
          this.state.groupsArray.forEach( element => {
            // console.log("element before", element)
            element.label = element.name;
            element.value = element.id;
            element.key = element.id;
            // console.log("element after", element);
          })

        }
      })
      .catch(function (error) {
        console.log(error);
      });

      this.setState({ groupPickerModalOpen: true })
    }

    splitTime(){
      var variable = this.state.newAlarmTime
      var splitArray
      splitArray = variable.split(":")
      console.log("splitArray", splitArray)
      this.setState( {newAlarmHour: Number(splitArray[0]) })
      this.setState( {newAlarmMinute: Number(splitArray[1]) })
    }

    AlarmsTable(props){
      const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
      };
  
      const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...props.alarms];
        const prevIndex = props.alarms.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        this.setState({ alarms: newData });
        console.log("rowKey", rowKey);
        this.removeAlarm(props.alarms[prevIndex].name, props.alarms);
      };
  
      onRowDidOpen = async(rowKey) => {
        console.log('This row opened', rowKey);
        const prevIndex = props.alarms.findIndex(item => item.key === rowKey);
        promise = await(this.setState({ openRow: Number(rowKey)}));
        // promise = await(this.setState({ openRow: Number(prevIndex) }));
        // console.log("openRow:", this.state.openRow)
        // console.log("typeof openRow:", typeof this.state.openRow)
      };
  
      const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
      };
  
      const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backLeftBtn]}
                onPress={() => this.getFirebaseUsersGroups()}
            >
              <Text style={styles.backTextWhite}>+Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnCenter]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
              <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
  
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
          <SwipeListView
                keyExtractor ={(item) => item.id} // specifying id as the key to prevent the key warning
                data = {props.alarms}
                renderItem={({ item }) => (
                <AlarmBanner>
                    <AlarmDetails title={item.name} hour={item.alarm_hour} minute={item.alarm_minute}/>
                    <SwitchExample/>
                    <Text>{item.switch}</Text>
                </AlarmBanner>
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

    componentDidMount(){
      this.registerForPushNotificationsAsync().then(token => this.setState({ expoPushToken: token }))//.catch(console.log(".catch"))

      // let the_subscription;
      this.state.notificationListener = Notifications.addNotificationReceivedListener(notification => this.setState({ notification: notification}))

      this.state.responseListener = Notifications.addNotificationResponseReceivedListener(response => {console.log("Response:", response)});
    
      return () => {
        Notifications.removeNotificationSubscription(this.state.notificationListener);
        Notifications.removeNotificationSubscription(this.state.responseListener);
      };
    
    };

    render(){
      // console.log("Initialize alarms")
      this.makeAlarms(this.state.alarms)
      this.state.alarms.sort(this.sortByTime)
      this.updateFirebaseUsersDoc()

      return(
        <View style={styles.container}>
          <TopBanner>
              <Text style={styles.pageTitle}>Alarms_Class</Text>

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
                  {/* <Text style={styles.Text}>DateTimePicker will go here</Text> */}
                  <Text style={styles.pageTitle}> Set a new alarm </Text>

                    <DatePicker
                      style={{height: 75, width: 200, color: "black"}}
                      date= {moment().format("LTS")} // Starts timepicker at current time (except always AM)
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

                  <Button
                    title="Split the time"
                    onPress={ async() =>
                      this.splitTime()
                    }
                  />

                  <Text style={styles.inputText}> time:{this.state.newAlarmTime} </Text>
                  <Text style={styles.inputText}> hour:{this.state.newAlarmHour} </Text>
                  <Text style={styles.inputText}> minute:{this.state.newAlarmMinute}</Text>
                  <Text style={styles.inputText}> title:{this.state.newAlarmText}</Text>


                  <Button style={styles.button}
                  title="Set Alarm"
                  onPress={ async() =>
                    this.addAlarm(this.state.newAlarmText, this.state.newAlarmHour, this.state.newAlarmMinute, (this.state.currentMaxKey + 1), this.state.alarms)
                    .then(this.setState({ newAlarmModalOpen: false }))
                    // this.setState({ newAlarmModalOpen: false })
                  }
                  />

                  <Button
                    title="Close Modal"
                    onPress={ async() =>
                      this.setState({ newAlarmModalOpen: false })
                    }
                  />

              </View>
              </Modal>
              {/*END OF MODAL FOR ADD ALARM */}

          </TopBanner>
        
          <View style={styles.scrollViewContainer}>
              {/* <Text>Your expo push token: {expoPushToken}</Text>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text>Title: {notification && notification.request.content.title} </Text>
              <Text>Body: {notification && notification.request.content.body}</Text>
              <Text>Data: {notification && JSON.stringify(notification.request.content.data.body)}</Text>
              </View> */}

            <this.AlarmsTable alarms={this.state.alarms}/>

          </View>

          <Button
            title="Print user email to console"
            onPress={ async() =>
              console.log("auth.currentUser.email:", auth.currentUser.email)
            }
          />

          <Button
            title="Remove all alarms"
            onPress={() => this.removeAllAlarms()}
          />

          {/*BEGINNING OF MODAL FOR GROUP PICKER */}
          <Modal visible={this.state.groupPickerModalOpen} animationType="slide">
          <View style={appStyles.modalContainer}>
              <MaterialIcons
              name="close"
              size={24}
              style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
              onPress={() => this.setState({ groupPickerModalOpen: false })}
              />
              <Text style={styles.pageTitle}> Select a group </Text>

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
                      color: "#fb5b5a",
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

              {/* <Text style={styles.inputText}>this.state.groupIdClicked:</Text>  */}
              {/* <Text style={styles.inputText}>{this.state.groupIdClicked}</Text>  */}

              <Text></Text>
                
              <Button
                title="Add alarm to group"
                color="lightgreen"
                onPress={ async() =>
                  this.updateFirebaseGroupsDoc()
                  // .then(this.setState({ groupPickerModalOpen: false }))
                }
                // onPress={ async() =>
                //   this.setState({ groupPickerModalOpen: false })
                // }
              />

              </View>
          </Modal>
          {/*END OF MODAL FOR GROUP PICKER */}

          {/* <Text style={styles.Text}> Share alarm with a group</Text> */}

          {/* <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Group name..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => this.setState({newGroupName: text})}
            />
          </View>

          <Button
            title="Share alarms with a group"
            onPress={ async() =>
              this.updateFirebaseGroupsDoc()
            }
          /> */}

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
  },

  inputText:{
    padding: 20,
    height: 50,
    color:"#ffffff",
    fontSize: 16
  },

  inputView:{
    width:"75%",
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
      // backgroundColor: '#DDD',
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
