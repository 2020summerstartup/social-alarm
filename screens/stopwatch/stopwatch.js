// Date and Time code from tutorial: https://www.youtube.com/watch?v=XaJb4pP5phk
// Stopwatch code from tutorial (youtube: Marcin Mieszek) https://www.youtube.com/watch?v=gWegskGYCtA
// Using https://momentjs.com/
// Using https://www.npmjs.com/package/react-moment
// Not yet using https://www.npmjs.com/package/react-native-alarm-notification
// Not yet using https://github.com/smartliang/react-native-alarm

import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {APPTEXTWHITE, APPTEXTBLUE, APPBACKGROUNDCOLOR} from '../../style/constants';

const moment = require("moment");
/*const DATA = {
  timer: 12345678,
  laps: [15611, 234, 345, 456, 567]
}*/

function Timer({ interval, style }) {
  const pad = (n) => (n < 10 ? "0" + n : n); // no zero hanging on left side if value less than 10
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())}:</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  );
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()} //when not disabled
      style={[styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.5} // means if disabled then 1.0, otherwise 0.5
    >

      <View style = {styles.buttonBorder}> 
        <Text style ={[ styles.buttonTitle, {color} ]}>{title}</Text>

      </View>
    </TouchableOpacity>
  );
}

function ButtonRow({ children }) {
  return <View style={styles.ButtonRow}>{children}</View>;
}

function Lap({ number, interval, fastest, slowest }) {
  const lapStyle = [
    styles.lapText,
    fastest && styles.fastest,
    slowest && styles.slowest,
  ];
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}</Text>
      <Timer style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>

  )
};

function LapsTable({ laps, timer }){ // first parameter is array of laps
  const finishedLaps = laps.slice(1) // only mark completed laps
  let min = Number.MAX_SAFE_INTEGER // initializing min value
  let max = Number.MIN_SAFE_INTEGER // initializing max values. Usin let because not a const. Could get changed in following if statement. 
  if (finishedLaps.length >= 2){
    finishedLaps.forEach(lap => {
      if (lap < min) min = lap
      if (lap > max) max = lap
    })

  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index == 0 ? timer + lap : lap} //if index is 0, then add timer and lap, otherwise just display lap (':' means otherwise)
          fastest={lap == min}
          slowest={lap == max}
        />
        /* Clever. We want the laps to display from most recent to least recent. We do laps.length (length of laps array) minus the index which "reverses" the order and also elimniates the "0" position so that the lap numbers start counting from 1 and are diplayed in decresing order. Pretty sneaky.
         */
      ))}
    </ScrollView>
  );
}

export default class Alarms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: moment().format("LTS"),
      date: moment().format("LL"),
      timer: 12345678,
      laps: [],
      start: 0,
      now: 0,
    };
  }

  componentWillUnmount(){
    clearInterval(this.timer) // Sidney wants to look into this more

  }

  start = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
      laps: [0],
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };

  lap = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps; // sets firstLap variable to the first element in the laps array and sets the "other" variable to the rest of the lap array (...other refers to the rest of the array)
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    });
  };

  stop = () => {
    clearInterval(this.timer);
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps; // sets firstLap variable to the first element in the laps array and sets the "other" variable to the rest of the lap array (...other refers to the rest of the array)
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    });
  };

  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    });
  };

  resume = () => {
    const now = new Date().getTime();
    this.setState({
      // not touching laps array in resume bc we don't need to
      start: now,
      now: now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };

  render() {
    const { now, start, laps } = this.state;
    const timer = now - start;

    setTimeout(() => {
      this.setState({
        time: moment().format("LTS"),
        date: moment().format("LL"),
      });
    }, 1000); // updates the time every 1000ms (seconds update)

    return (
      <View style={styles.container}>
        <Timer
          interval={laps.reduce((total, curr) => total + curr, 0) + timer}
          /*laps.reduce() sums all the times in the laps and then + timer adds the current lap. This makes main timer display the total time since the beginning of the first lap*/
          style={styles.timer}
        />

        {laps.length == 0 && (
          <ButtonRow>
            <RoundButton
              title="Lap"
              color="#000000"
              background="#858585"
              disabled
            />
            <RoundButton
              title="Start"
              color="#FFFFFF"
              background="#54E33B"
              onPress={this.start}
            />
          </ButtonRow>
        )}

        {start > 0 && (
          <ButtonRow>
            <RoundButton
              title="Lap"
              color="#FFFFFF"
              background="#858585"
              onPress={this.lap}
            />
            <RoundButton
              title="Stop"
              color="#FFFFFF"
              background="#E32636"
              onPress={this.stop}
            />
          </ButtonRow>
        )}

        {laps.length > 0 && start == 0 && (
          <ButtonRow>
            <RoundButton
              title="Reset"
              color="#FFFFFF"
              background="#858585"
              onPress={this.reset}
            />
            <RoundButton
              title="Resume"
              color="#FFFFFF"
              background="#54E33B"
              onPress={this.resume}
            />
          </ButtonRow>
        )}

        {/*<LapsTable laps ={DATA.laps}/>*/}
        <LapsTable laps={laps} timer={timer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: 'center',

    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  timeText: {
    color: APPTEXTBLUE,
    fontSize: 50,
  },

  dateText: {
    color: APPTEXTBLUE,
    fontSize: 30,
  },

  timer: {
    color: APPTEXTBLUE,
    fontSize: 70,
    fontWeight: "300",
    flex: 1,
    alignItems: "center",
    // justifyContent: 'flex-end',
    paddingTop: 10,

    width: 100

  },

  timerContainer: {
    flexDirection: "row",
  },

  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonTitle: {
    fontSize: 18,
  },

  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    color: APPTEXTWHITE,
  },

  ButtonRow: {
    flex: 2, // Not sure why higher value this makes the button row move up page
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 30,
  },

  lap: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: APPTEXTBLUE,
    borderTopWidth: 1,
    paddingVertical: 10,
  },

  lapText: {
    color: "black",
    fontSize: 18,
    width: 35,
  },

  lapTimer:{
    width: 25,

  },

  scrollView: {
    alignSelf: "stretch",
  },

  fastest: {
    color: "#4BC05F",
  },

  slowest: {

    color: "#CC3551"
  }
});

