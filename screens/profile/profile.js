import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { auth, db } from "../../firebase/firebase";
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../../style/constants';

/* profile.js
 * Profile screen
 * contains sign out button
 */

export default function Profile({ navigation }) {
  var user = auth.currentUser;

  // signOutUser - navigates user to login screen/stack, signs out user via firebase
  // DEBUGGING NOW - NOT FUNCTIONAL
  // navigation problems, but async storage stuff works (just reload app)
  signOutUser = async () => {
    //navigation.navigate('Auth');
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    auth.signOut().catch((error) => console.log(error))
    /*
    auth.signOut().then(function(user) {
      // await AsyncStorage.removeItem(userToken);
      navigation.navigate('Auth');
      // sign out successful
      
        
    }).catch(function(error) {
      // errors
    }) */

    // {db.collection('users').doc(user.uid).get()}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Name: </Text>
      <Text style={styles.logo}>Age: </Text>
      <Text style={styles.logo}>Location: </Text>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => this.signOutUser()}
      >
        <Text style={styles.loginText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  name: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPBACKGROUNDCOLOR,
    marginBottom: 5,
    marginTop: 35,
    marginLeft: 20,
  },

  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPBACKGROUNDCOLOR,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 20,
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
