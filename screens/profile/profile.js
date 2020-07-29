import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import Profile3 from './Profile3';
import { auth } from "../../firebase/firebase";
import { appStyles } from "../../style/stylesheet";

/* profile.js
 * Profile screen
 * TO DO: delete this file? all the code is in Profile3.js
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
