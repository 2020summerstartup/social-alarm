import React, { Component } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebase";
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../../style/constants';
import Profile3 from './Profile3';

/* profile.js
 * Profile screen
 */


export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      <Profile3/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
