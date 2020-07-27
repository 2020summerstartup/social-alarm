import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { auth } from "../../firebase/firebase";
import { appStyles } from '../../style/stylesheet';
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
      <Text style={styles.text}>Age: </Text>
      <Text style={styles.text}>Location: </Text>

      <TouchableOpacity
        style={appStyles.loginBtn}
        onPress={() => this.signOutUser()}
      >
        <Text style={appStyles.loginText}>Sign Out</Text>
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

  text: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPBACKGROUNDCOLOR,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 20,
  },

});
