// home.js

import React, { useState, Fragment } from "react";
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
import { Formik } from "formik";
import * as  yup from  "yup";

/* login.js
 * Login screen
 *
 */


const reviewSchema = yup.object({
  email: yup.string()
    .required("Email must be a valid email address")
    .email("Email must be a valid email address"),
  password: yup.string()
    .required("Password must be at least 6 characters")
    .min(6, "Password must be at least 6 characters"),
})

export default function Login({ navigation }) {

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
                TeamTime
              </Text>
              {/* text input fields (email, password) */}

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={reviewSchema}
                onSubmit={(values) => {
                  loginUser(values.email.trim(), values.password);
                }}
              >
                {(props) => (
                  <Fragment>
                    <View
                      style={{
                        ...appStyles.inputView,
                        backgroundColor: theme.APPINPUTVIEW,
                        marginBottom: 2,
                        marginTop: 5,
                        
                      }}
                    >
                      <TextInput
                        style={appStyles.inputText}
                        placeholder="Email..."
                        placeholderTextColor="#003f5c"
                        keyboardType="email-address"
                        value={props.values.email}
                        onBlur={props.handleBlur("email")}
                        onChangeText={props.handleChange("email")}
                      />
                    </View>

                    <Text style={{color: "red"}}>{props.touched.email && props.errors.email}</Text>

                    <View
                      style={{
                        ...appStyles.inputView,
                        backgroundColor: theme.APPINPUTVIEW,
                        marginBottom: 2,
                        marginTop: 5,
                      }}
                    >
                      <TextInput
                        secureTextEntry
                        style={appStyles.inputText}
                        placeholder="Password..."
                        placeholderTextColor="#003f5c"
                        value={props.values.password}
                        onBlur={props.handleBlur("password")}
                        onChangeText={props.handleChange("password")}
                      />
                    </View>

                    <Text style={{color: "red", marginBottom: 10}}>{props.touched.password && props.errors.password}</Text>

                    {/* forgot password button */}
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text
                        style={{
                          ...appStyles.forgot,
                          color: theme.APPTEXTBLACK,
                        }}
                      >
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>

                    {/* login button */}
                    <TouchableOpacity
                      style={{
                        ...appStyles.loginBtn,
                        backgroundColor: theme.APPTEXTRED,
                      }}
                      //onPress={() => this.loginUser(email.trim(), password)}
                      onPress={props.handleSubmit}
                    >
                      <Text
                        style={{
                          ...appStyles.loginText,
                          color: theme.APPTEXTBLACK,
                        }}
                      >
                        LOGIN
                      </Text>
                    </TouchableOpacity>

                    {/* signup button */}
                    <TouchableOpacity onPress={() => this.signUpUser()}>
                      <Text
                        style={{
                          ...appStyles.loginText,
                          color: theme.APPTEXTBLACK,
                        }}
                      >
                        Signup
                      </Text>
                    </TouchableOpacity>
                  </Fragment>
                )}
              </Formik>
            </View>
          </TouchableWithoutFeedback>
        );
      }}
    </NotificationContext.Consumer>
  );
}
