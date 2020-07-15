// signup.js
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from "react-native";
import { render } from "react-dom";
import * as firebase from "firebase";
import Navigator from "./navigation";
// import { NavigationContainer } from '@react-navigation/native';
// import NavigationContainer from './navigation';

/* signup.js
 * SignUp screen
 *
 */

export default function SignUp({ navigation }) {
  //const firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");

  var db = firebase.firestore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // signUpUser - called when user presses sign up button
  // if passwords match, signs user up (and logs them in) and navigates to App
  // TODO: if passwords don't match, some kind of alert
  signUpUser = async (email, password, confirmPassword, name) => {
    try {
      if (password == confirmPassword) {
        await AsyncStorage.setItem("userToken", email);

        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(function (user) {
            db.collection("users")
              .doc(user.user.uid)
              .set({
                name: name,
                email: email,
                alarms: [],
                groups: [],
              })
              .then(navigation.navigate("App"))
              .catch(console.log("idk"));
          })
          .catch(function (error) {
            Alert.alert("Oops!", error.toString(), [{ text: "ok" }]);
          });
      } else {
        console.log("passwords dont match");
        Alert.alert("Oops!", "your passwords don't match", [{ text: "ok" }]);
        // TODO: make this pop up on app
      }
    } catch (error) {
      console.log(error.toString());
    }
  };

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sign Up</Text>
      <View style={styles.inputView}>
        {/* text inputs - email, password, confirm password */}
        <TextInput
          style={styles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Confirm password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Name..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </View>

      {/* sign up button */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => this.signUpUser(email, password, confirmPassword, name)}
      >
        <Text style={styles.loginText}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
  },

  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  inputText: {
    height: 50,
    color: "white",
  },

  forgot: {
    color: "white",
    fontSize: 13,
  },

  loginText: {
    color: "white",
    fontSize: 15,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});
