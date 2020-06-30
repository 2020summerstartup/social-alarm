// code from tutorial: https://www.youtube.com/watch?v=XaJb4pP5phk
// Using https://momentjs.com/
// Using https://www.npmjs.com/package/react-moment
// Not yet using https://www.npmjs.com/package/react-native-alarm-notification
// Not yet using https://github.com/smartliang/react-native-alarm
// Stopwatch features from https://www.youtube.com/watch?v=gWegskGYCtA

import React, { Component } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, HeaderBackground } from 'react-navigation-stack';
import Moment from 'moment';

const moment = require("moment");
const DATA = {
  timer: 12345678,
  laps: [1, 2, 3, 4, 5]
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
    <View>
      <Text>title</Text>
    </View>
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
    }, 1000) // updates the time every 1000ms (so seconds update)

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Text style={styles.timeText}>
          {this.state.time}
        </Text>
        <Text style={styles.dateText}>
          {this.state.date}
        </Text>
        <Timer interval={DATA.timer} />
        <RoundButton title='Start' color='#50D167' background='#1B361F' />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: 'center',
    paddingTop: 100,
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
    color: "#FAAAFF",
    fontSize: 70,
    fontWeight: "300",
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'flex-end',
    paddingTop: 200,
  },
});