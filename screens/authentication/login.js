// home.js

import React, { useState } from "react";
import "react-native-gesture-handler";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth } from "../../firebase/firebase";
import {appStyles} from '../../style/stylesheet';

/* login.js
 * Login screen
 *
 */

export default function Login({ navigation }) {
  // states - contains info that user entered
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signUpUser - called when user presses sign up button,
  // navigates to sign up page
  signUpUser = () => {
    navigation.navigate("SignUp");
  };
  // loginUser - called when user presses login button
  // logs user in via firebase, navigates to App page (bottom tab navigator)
  loginUser = async (email, password) => {
    try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      auth
        .signInWithEmailAndPassword(email, password)
        .then(function (user) {
          navigation.navigate("App");
        })
        .catch(function (error) {
          Alert.alert("Oops!", error.toString().substring(6), [{ text: "OK" }]);
        });
    } catch (error) {
      console.log(error.toString());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={appStyles.loginContainer}>
        <Text style={appStyles.logo}>Group Alarm</Text>
        {/* text input fields (email, password) */}
        <View style={appStyles.inputView}>
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
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* forgot password button */}
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={appStyles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* login button */}
        <TouchableOpacity
          style={appStyles.loginBtn}
          onPress={() => this.loginUser(email, password)}
        >
          <Text style={appStyles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        {/* signup button */}
        <TouchableOpacity onPress={() => this.signUpUser()}>
          <Text style={appStyles.loginText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

