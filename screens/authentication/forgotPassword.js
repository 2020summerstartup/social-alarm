// home.js
import React, { useState } from "react";
import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { auth } from "../../firebase/firebase";
import { APPTEXTRED } from "../../style/constants";
import { appStyles } from "../../style/stylesheet";
import { NotificationContext } from "../../contexts/NotificationContext";

/* forgotPassword.js
 * Forgot password screen
 * when user enters email, sends them an email to reset their password
 *
 */

export default function Login({ navigation }) {
  // states - contains info that user entered
  const [email, setEmail] = useState("");

  // forgotPass - called when user hits forgot password button
  // sends reset password email to email in text box
  forgotPass = (email) => {
    // send password reset email
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        // if it works - send an alert so user knows an email was sent
        Alert.alert("Great!", "An email has been sent to your account", [
          // when user presses ok - navigates them back to login
          { text: "OK", onPress: () => navigation.pop() },
        ]);
      })
      .catch(function (error) {
        // error - send alert
        Alert.alert("Oops!", error.toString().substring(6), [{ text: "OK" }]);
      });
  };

  return (
    <NotificationContext.Consumer>
      {(context) => {
        // dark mode theme stuff
        const { isDarkMode, light, dark } = context;

        const theme = isDarkMode ? dark : light;

        return (
          // if user taps anywhere keyboard goes away
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                ...appStyles.loginContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
            >
              {/* forogt password "logo" text */}
              <Text style={{ ...styles.logoTop, color: theme.APPTEXTRED }}>
                Forgot
              </Text>
              <Text style={{ ...appStyles.logo, color: theme.APPTEXTRED }}>
                Password?
              </Text>
              <View
                style={{
                  ...appStyles.inputView,
                  backgroundColor: theme.APPINPUTVIEW,
                }}
              >
                {/* email text input */}
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

              {/* forgot pass button */}
              <TouchableOpacity
                style={{
                  ...appStyles.loginBtn,
                  backgroundColor: theme.APPTEXTRED,
                }}
                onPress={() => this.forgotPass(email.trim())}
              >
                <Text
                  style={{ ...appStyles.loginText, color: theme.APPTEXTBLUE }}
                >
                  Send password reset email
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        );
      }}
    </NotificationContext.Consumer>
  );
}

const styles = StyleSheet.create({
  logoTop: {
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 0,
  },
});
