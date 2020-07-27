import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';

export default class datepicker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      time: '20:00',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <DatePicker
          style={{width: 200}}
          date={this.state.time}
          mode="time"
          format="HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          minuteInterval={1}
          onDateChange={(time) => {this.setState({time: time});}}
        />
        <Text style={styles.instructions}>time: {this.state.time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    justifyContent: 'center',
    color: '#333333',
    marginBottom: 5
  }
});