import React, { Component } from 'react';
import { StyleSheet, Button, View, Switch, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwitchExample from '../components/toggleSwitch';
// import { createAlarm } from '../node_modules/react-native-simple-alarm';
import moment from 'moment'

export default class HomeContainer extends Component 
{
    
    render() {
       return (
          <View style={styles.container}>
             <SwitchExample />
          </View>
       );
    }
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
})


