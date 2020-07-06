// home.js
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import  {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';

/* forgotPassword.js
 * Forgot password screen
 * when user enters email, sends them an email to reset their password
 * 
 */

export default class App extends Component
{
  state={
    email:'',
  }

  // forgotPass - called when user hits forgot password button
  // sends reset password email to email in text box
  forgotPass = (email) => {
    firebase.auth().sendPasswordResetEmail(this.state.email).then(function(){
        /* email sent */}).catch(function(error) { /* error */})
  }


  render(){
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }

    return (
      <View style={styles.container}>
        <Text style={styles.logoTop}>Forgot</Text>
        <Text style={styles.logo}>Password?</Text>
        <View style={styles.inputView}>
        {/* email text input */}
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {
              this.setState({email: text})}}/>
        </View>
        
        {/* forgot pass button */}
        <TouchableOpacity style={styles.loginBtn} onPress={ this.forgotPass(this.state.email)}>
          <Text style={styles.forgot}>Send password reset email</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTop:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:0,
  },

  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40,
  },

  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },

  inputText:{
    height:50,
    color:"white",
  },

  forgot:{
    color:"white",
    fontSize:13
  },

  loginText:{
    color:"white",
    fontSize:15
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

});