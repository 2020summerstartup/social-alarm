// signup.js
import React, { useState } from "react";
import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { db, auth } from "../../firebase/firebase";
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../../style/constants';
import {appStyles} from '../../style/stylesheet';

/* signup.js
 * SignUp screen
 *
 */

export default function SignUp({ navigation }) {
  //const firebase = require("firebase");
  // Required for side-effects
  // require("firebase/firestore");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // signUpUser - called when user presses sign up button
  // if passwords match, signs user up (and logs them in) and navigates to App
  signUpUser = async (email, password, confirmPassword, name) => {
    try {
      if (password == confirmPassword) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("password", password);

        auth
          .createUserWithEmailAndPassword(email, password)
          .then(function (user) {
            db.collection("users")
              .doc(email)
              .set({
                name: name,
                email: email,
                uid: user.user.uid,
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
  /*
  if (!firebase.apps.length) {
    firebase.initializeApp({});
  } */

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.logo}>Sign Up</Text>
        <View style={appStyles.inputView}>
          {/* text inputs - email, password, confirm password */}
          <TextInput
            style={appStyles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            keyboardType="email-address"
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
        </View>

        <View style={appStyles.inputView}>
          <TextInput
            secureTextEntry
            style={appStyles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
        </View>

        <View style={appStyles.inputView}>
          <TextInput
            secureTextEntry
            style={appStyles.inputText}
            placeholder="Confirm password..."
            placeholderTextColor="#003f5c"
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
        </View>

        <View style={appStyles.inputView}>
          <TextInput
            style={appStyles.inputText}
            placeholder="Name..."
            placeholderTextColor="#003f5c"
            autoCorrect={false}
            onChangeText={(text) => {
              setName(text);
            }}
          />
        </View>

        {/* sign up button */}
        <TouchableOpacity
          style={appStyles.loginBtn}
          onPress={() =>
            this.signUpUser(email, password, confirmPassword, name)
          }
        >
          <Text style={appStyles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    paddingTop: 20,
    //justifyContent: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 20,
  },
});
