import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as firebase from 'firebase';

/* profile.js
 * Profile screen
 * contains sign out button
 */

export default function Profile ({navigation})
{
  var user = firebase.auth().currentUser;

  // signOutUser - navigates user to login screen/stack, signs out user via firebase
  // DEBUGGING NOW - NOT FUNCTIONAL
  // navigation problems, but conce
  const signOutUser = async () => {
    navigation.navigate('Auth');
    /*(firebase.auth().signOut().then(function() {
      // sign out successful
      
        
    }).catch(function(error) {
      // errors
    });*/

  }
  return (
    
    <View style={styles.container}>
      <Text style={styles.name}>Name: </Text>
      <Text style={styles.logo}>Age: </Text>
      <Text style={styles.logo}>Location: </Text>
      {/*<Text style={styles.logo}>Email: {user.email}</Text>*/}

      <TouchableOpacity style={styles.loginBtn}  onPress={ () => navigation.navigate('Auth') } >
        <Text style={styles.loginText}>Sign Out</Text>
      </TouchableOpacity>

    </View>

  )
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

  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
})
