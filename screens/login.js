// home.js
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage,Alert } from 'react-native';
import {auth} from './firebase';

// import Navigator from './navigation';
// import { NavigationContainer } from '@react-navigation/native';
// import NavigationContainer from './navigation';


/* login.js
 * Login screen
 * also contains firebase configs
 * 
 */



export default function Login({navigation})
{
  // states - contains info that user entered
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // signUpUser - called when user presses sign up button, 
  // navigates to sign up page
  signUpUser = () => {
    navigation.navigate('SignUp')

  };
  // loginUser - called when user presses login button
  // logs user in via firebase, navigates to App page (bottom tab navigator)
  // TODO: add AsyncStorage so user stays signed in
  loginUser = async (email, password) => {
    console.log('login');
    
    

    console.log({email});
    try {
      await AsyncStorage.setItem('userToken', email);
      auth.signInWithEmailAndPassword(email, password).then(function(user){
        
        navigation.navigate('App');
        console.log(user);
        }).catch(function(error) {
          Alert.alert('Oops!', error.toString().substring(6), [{text:'ok'}]);
        })
        
      } catch (error) {
      console.log(error.toString())
      //Alert.alert('Oops!', error.toString(), [{text:'ok'}]);
    }
    
  }
/*
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }
*/
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Group Alarm</Text>
        {/* text input fields (email, password) */}
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

        {/* forgot password button */}
        <TouchableOpacity onPress={ () => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* login button */}
        <TouchableOpacity style={styles.loginBtn}  onPress={ () => this.loginUser(email, password) } >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        {/* signup button */}
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