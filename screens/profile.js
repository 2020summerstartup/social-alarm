import React, { Component } from 'react';
import { StyleSheet, Button, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as firebase from 'firebase';

export default class Profile extends Component 
{
  render() {
    var user = firebase.auth().currentUser;
    return (
      
      <View style={styles.container}>
        <Text style={styles.name}>Name: </Text>
        <Text style={styles.logo}>Age: </Text>
        <Text style={styles.logo}>Location: </Text>
        <Text style={styles.logo}>Email: {user.Email}</Text>
      </View>

    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  name:{
    fontWeight:"bold",
    fontSize:20,
    color:"#003f5c",
    marginBottom:5,
    marginTop:35,
    marginLeft:20,
  },

  logo:{
    fontWeight:"bold",
    fontSize:20,
    color:"#003f5c",
    marginBottom:5,
    marginTop:5,
    marginLeft:20,
  },
})
