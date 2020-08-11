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
import { appStyles } from "../../style/stylesheet";
import { NotificationContext } from "../../contexts/NotificationContext";

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
      // set login credentials in local storage
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      // sign user in with firebase and navigate to App
      auth
        .signInWithEmailAndPassword(email, password)
        .then(function (user) {
          navigation.navigate("App");
        })
        .catch(function (error) {
          // have an alert notifying user if there's an error
          Alert.alert("Oops!", error.toString().substring(6), [{ text: "OK" }]);
        });
    } catch (error) {
      console.log(error.toString());
    }
  };

  return (
    <NotificationContext.Consumer>
      {(context) => {
        // determines appropriate theme
        const { isDarkMode, light, dark } = context;

        const theme = isDarkMode ? dark : light;

        return (
          // dismisses keyboard when user presses anywhere
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                ...appStyles.loginContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
            >
              <Text style={{ ...appStyles.logo, color: theme.APPTEXTRED }}>
                Group Alarm
              </Text>
              {/* text input fields (email, password) */}
              <View
                style={{
                  ...appStyles.inputView,
                  backgroundColor: theme.APPINPUTVIEW,
                }}
              >
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

              <View
                style={{
                  ...appStyles.inputView,
                  backgroundColor: theme.APPINPUTVIEW,
                }}
              >
                <TextInput
                  secureTextEntry
                  style={appStyles.inputText}
                  placeholder="Password..."
                  placeholderTextColor="#003f5c"
                  onChangeText={(text) => setPassword(text)}
                />
              </View>

              {/* forgot password button */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={{ ...appStyles.forgot, color: theme.APPTEXTBLACK }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* login button */}
              <TouchableOpacity
                style={{
                  ...appStyles.loginBtn,
                  backgroundColor: theme.APPTEXTRED,
                }}
                onPress={() => this.loginUser(email.trim(), password)}
              >
                <Text
                  style={{ ...appStyles.loginText, color: theme.APPTEXTBLACK }}
                >
                  LOGIN
                </Text>
              </TouchableOpacity>

              {/* signup button */}
              <TouchableOpacity onPress={() => this.signUpUser()}>
                <Text
                  style={{ ...appStyles.loginText, color: theme.APPTEXTBLACK }}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        );
      }}
    </NotificationContext.Consumer>
  );
}
