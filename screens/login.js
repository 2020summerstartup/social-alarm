// home.js
import React, { Component, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import  {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';
// import Navigator from './navigation';
// import { NavigationContainer } from '@react-navigation/native';
// import NavigationContainer from './navigation';

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

firebase.initializeApp(firebaseConfig);

export default function Login({navigation})
{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
/*
  state={
    email:'',
    password:'',
  }*/

  signUpUser = () => {
    navigation.navigate('SignUp')

  };

  loginUser = async (email, password) => {
    console.log('login');
    
    // await AsyncStorage.setItem('userToken', 'abc');
    
    navigation.navigate('App');
    console.log({email});
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
        console.log(user);
        })
      }
      catch (error) {
      console.log(error.toString())
    }
    
  }

    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }

    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Group Alarm</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {setEmail(text)}}/>
        </View>

        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setPassword(text)}/>
        </View>

        <TouchableOpacity onPress={ () => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn}  onPress={ () => this.loginUser(email, password) } >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={ () => this.signUpUser()} >
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>

      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
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
    backgroundColor:"#465881",
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

});