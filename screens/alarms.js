// code from tutorial: https://www.youtube.com/watch?v=XaJb4pP5phk
// Stopwatch features from https://www.youtube.com/watch?v=gWegskGYCtA
// Using https://momentjs.com/
// Using https://www.npmjs.com/package/react-moment
// Not yet using https://www.npmjs.com/package/react-native-alarm-notification
// Not yet using https://github.com/smartliang/react-native-alarm

import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackground } from 'react-navigation-stack';
import Moment from 'moment';

const moment = require("moment");
const DATA = {
  timer: 12345678,
  laps: [123, 234, 345, 456, 567]
}

function Timer({ interval }) {
  const duration = moment.duration(interval)
  return (
    <Text style={styles.timer}>
      {duration.minutes()}:{duration.seconds()}:{duration.milliseconds()}
    </Text>
  )
};

function RoundButton({ title, color, background }) {
  return (
  <View style ={[styles.button, {backgroundColor: background}]}>
      <View style = {styles. buttonBorder}> 
        <Text style ={[ styles.buttonTitle, {color} ]}>{title}</Text>
      </View>
    </View>
  )
};

function ButtonRow({ children }){
  return(
    <View style = {styles.ButtonRow}>{children}</View>
  )
};

function Lap({ number, interval }){
  return (
    <View style = {styles.lap}>
      <Text style = {styles.lapText}>Lap {number}</Text>
      <Text style = {styles.lapText}>{interval}</Text>
    </View>
  )
};

function LapsTable({ laps }){ // single parameter is array of laps
  return(
    <ScrollView>
      {laps.map((lap, index) => (
        <Lap number = {laps.length - index} key = {laps.length} interval = {lap}/>
      /* The previous line is pretty clever. We want the laps to display from most recent to least recent. We do laps.length (length of laps array) minus the index which "reverses" the order and also elimniates the "0" position so that the lap numbers start counting from 1 and are diplayed in decresing order. Pretty sneaky. 
       */
      ))}
    </ScrollView>
  )
};

export default class Alarms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: moment().format("LTS"),
      date: moment().format("LL")
    };
  }

  render() {
    setTimeout(() => {
      this.setState({
        time: moment().format("LTS"),
        date: moment().format("LL")
      })
    }, 1000) // updates the time every 1000ms (seconds update)

    return (
      <View style={styles.container}>
        {/* <Text style={styles.timeText}>
          {this.state.time}
        </Text>
        <Text style={styles.dateText}>
          {this.state.date}
        </Text>*/}
        <Timer interval={DATA.timer} />
        <ButtonRow>
          <RoundButton title='Reset' color='#FFFFFF' background='#858585'/>
          <RoundButton title='Start' color='#FFFFFF' background='#54E33B'/>
          <RoundButton title='Stop' color='#FFFFFF' background='#E32636'/>
        </ButtonRow>
        <LapsTable laps ={DATA.laps}/>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#0D0D0D",
    backgroundColor: "#C1C3C1",
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center', 
    justifyContent: 'flex-start' 
  },

  timeText: {
    color: "#0B132B",
    fontSize: 50
  },

  dateText: {
    color: "#0B132B",
    fontSize: 30
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 70,
    fontWeight: "300",
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    paddingTop: 100,
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }, 

  buttonTitle: {
    fontSize: 18,
  }, 

  buttonBorder: {
    width: 76, 
    height: 76, 
    borderRadius: 38, 
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    color: "#FFFFFF",
  },

  ButtonRow: {
    flex: 2, // Not sure why higher value this makes the button row move up page
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 30,
  },

  lap: {
    color: "#000000",
  },

  lapText: {
    color: "#000000",
  },

});