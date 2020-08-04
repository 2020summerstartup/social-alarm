import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import Profile3 from './Profile3';

/* profile.js
 * Profile screen
 * TO DO: delete this file? all the code is in Profile3.js
 */

export default function Profile() {
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
