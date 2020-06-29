/* Color codes from coolors.co 
Oxford Blue #0B132B
Little Boy Blue #71A9F7
Orange Red Crayola #FB5B5A
Purple Navy #465881
Blue Yonder #566C9F
*/

import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { render } from 'react-dom';

import * as firebase from 'firebase';
import Moment from 'moment';
// import KeepAwake from "react-native-keep-awake";

const moment = require("moment");

var firebaseConfig = {
  apiKey: "AIzaSyA2J1UBQxi63ZHx3-WN7C2pTOZRh1MJ3bI",
  authDomain: "social-alarm-2b903.firebaseapp.com",
  databaseURL: "https://social-alarm-2b903.firebaseio.com",
  projectId: "social-alarm-2b903",
  storageBucket: "social-alarm-2b903.appspot.com",
  /*messagingSenderId: "828360870887",
  appId: "1:828360870887:web:8d203554e5b469c1dd8b42",
  measurementId: "G-KXCXV485FZ"*/
};

/*try {
  firebase.initializeApp({firebaseConfig})
}
catch(err){
}*/

import {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';

export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      time: moment().format("LTS"),
      date: moment().format("LL")
    }
  }

  state={
    email:"",
    password:""
  }

  signUpUser = (email, password) => {
    console.log('signup')
    try{
      firebase.auth().createUserWithEmailAndPassword(email, password);

    } 
    catch(error) {
      console.log(error.toString())
    }

  }

  loginUser = (email, password) => {
    console.log('login')
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        console.log(user)
      })


    } catch (error) {
      console.log(error.toString())
    }
    
  }

  render(){
    if (!firebase.apps.length) {
      firebase.initializeApp({});
   }
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>
          {this.state.time}
        </Text>
        <Text style={styles.dateText}>
          {this.state.date}
        </Text>
        <Text style={styles.logo}>Group Alarm</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({email:text})}/>
        </View>

        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={text => this.setState({password:text})}/>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn}  onPress={ () => this.loginUser(this.state.email, this.state.password)} >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={ () => this.signUpUser(this.state.email, this.state.password)} >
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71A9F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },

  inputView:{
    width:"80%",
    backgroundColor:"#566C9F",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },

  inputText:{
    height:50,
    color:"white"
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

  clock:{
    flex: 1,
    backgroundColor: '#000',
    justifyContent: "center",
    alignItems: "center"
  },

  timeText:{
    color: "#0B132B",
    fontSize: 50
  },

  dateText:{
    color: "#0B132B",
    fontSize: 30
  }

});

/*const screens = {
  LogIn: {
    screen: LogIn
  },
  Home: {
    screen: Home
  }
}*/