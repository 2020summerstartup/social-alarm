import React, { useState, useEffect, Component } from 'react';
// import { StyleSheet, Button, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { StyleSheet, View, Switch, Text, TextInput, Platform, TouchableOpacity, ScrollView, Modal, Listview, FlatList} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample, {switchValue} from '../components/toggleSwitch';
import Moment from 'moment';

// import  {Container, Content, Header, Form, Input, Item, Label} from 'native-base';
import  {Container, Content, Header, Form, Input, Item, Button, Label, Icon, List} from 'native-base';

import { APPBACKGROUNDCOLOR } from './constants';
import { appStyles } from './stylesheet';

import Constants from 'expo-constants';

import * as firebase from 'firebase';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

import {createAlarm} from '../helpers/createAlarm';
import { MaterialIcons } from "@expo/vector-icons";

function TopBanner({ children }){
    return(
      <View style = {styles.topBanner}>{children}</View>
    )
};

function AlarmsTable(){
    const [alarms, setAlarms] = useState([
        {name: 'First Alarm', time: '5:15', switch: 'false', key: '1'},
        {name: 'Second Alarm', time: '4:15', switch: 'false', key: '2'},
        {name: 'Third Alarm', time: '3:15', switch: 'true', key: '3'},
    ]);

    var theSwitchIsOn = 'false'
    if(switchValue == true){
      theSwitchIsOn = 'true'
    }

    return(
    <ScrollView style = {styles.scrollView}>
        {alarms.map((list_item) => (
            <View key={list_item.key}>
                <AlarmBanner>
                    <AlarmDetails title={list_item.name} time={list_item.time}/>
                    <SwitchExample/>
                    <Text>{theSwitchIsOn}</Text>
                </AlarmBanner>
            </View>
            )
        )}
    </ScrollView>
    )
};

function AlarmBanner({ children }) {
    return(
      <View style = {styles.alarmBanner}>{children}</View>
    )
};

function AlarmDetails({title, time}){
    return (
      <View style={styles.alarmDetails}>
        <Text style={styles.alarmTime}>{time}</Text>
        <Text style={styles.alarmText}>
          {title}
        </Text>
      </View>
    )
};

export default class Alarm extends Component {

    constructor(props) {
        super(props);

        // const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
        // const ds = new FlatList.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});

        this.state = {
            alarm_title: "This is the alarm title",
            alarm_hour: 0,
            alarm_minute: 0,
            alarm_second: 0,
            modalOpen: false,
        };
    }

    // const [modalOpen, setModalOpen] = useState(false);
    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);

    registerForPushNotificationsAsync = async() => {
        let token;

        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }

            // Stops here and returns if the user did not grant permission
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        }
        else {
            alert('Must use physical device for Push Notifications');
        }
        return token;
    }

    render() {
        return (
            <View>
                <Header>
                    <Content>
                        <Item>
                            <Input
                            placeholder = "Add Alarm"
                            />
                            <Button>
                                <Icon name ="add" />
                            </Button>
                        </Item>
                    </Content>
                </Header>
                <AlarmsTable/>
            </View>

            /* <View style={styles.container}>
                <TopBanner>
                    <Text style={styles.pageTitle}>Alarms</Text>
                    <MaterialIcons
                        name="add"
                        size={24}
                        style={appStyles.modalToggle}
                        // onPress={() => this.setState({modalOpen:true})}
                    />
                    <Modal visible={this.state.modalOpen} animationType="slide">
                        <View style={appStyles.modalContainer}>
                            <MaterialIcons
                                name="close"
                                size={24}
                                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                                // onPress={() => this.setState({modalOpen:false})}
                            />
                            <Text style={styles.Text}>DateTimePicker will go here</Text>
                        </View>
                    </Modal>
                </TopBanner>
                
                <View style={styles.scrollViewContainer}>
                    <AlarmsTable/>
                    <Button
                        title="Send a notification now"
                        onPress={async () => {
                        await sendPushNotification(expoPushToken);
                        }}
                    />
                </View>
            </View> */
        );
    }
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
    paddingTop: 10,
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
    backgroundColor: "white",
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
