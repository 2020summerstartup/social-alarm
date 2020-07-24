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
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../../style/constants';

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
          { text: "ok", onPress: () => navigation.pop() },
        ]);
      })
      .catch(function (error) {
        Alert.alert("Oops!", error.toString().substring(6), [{ text: "ok" }]);
      });
  };
  /*
    if (!firebase.apps.length) {
      firebase.initializeApp({});
    }
*/
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.logoTop}>Forgot</Text>
        <Text style={styles.logo}>Password?</Text>
        <View style={styles.inputView}>
          {/* email text input */}
          <TextInput
            style={styles.inputText}
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
          style={styles.loginBtn}
          onPress={() => this.forgotPass(email)}
        >
          <Text style={styles.forgot}>Send password reset email</Text>
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
    justifyContent: "center",
  },
  logoTop: {
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 0,
  },

  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
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
    color: APPTEXTWHITE,
  },

  forgot: {
    color: APPTEXTWHITE,
    fontSize: 13,
  },

  loginText: {
    color: APPTEXTWHITE,
    fontSize: 15,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: APPTEXTRED,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});
