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
import { APPTEXTRED } from '../../style/constants';
import { appStyles } from '../../style/stylesheet';

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
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        Alert.alert("Great!", "An email has been sent to your account", [
          { text: "OK", onPress: () => navigation.pop() },
        ]);
      })
      .catch(function (error) {
        Alert.alert("Oops!", error.toString().substring(6), [{ text: "OK" }]);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={appStyles.loginContainer}>
        <Text style={styles.logoTop}>Forgot</Text>
        <Text style={appStyles.logo}>Password?</Text>
        <View style={appStyles.inputView}>
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
          style={appStyles.loginBtn}
          onPress={() => this.forgotPass(email)}
        >
          <Text style={appStyles.loginText}>Send password reset email</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
