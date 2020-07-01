import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default class Profile extends Component 
{
  render() {
    return (
      <View style={styles.container}>
        <Text>Stopwatch!</Text>
      </View>
    )
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
