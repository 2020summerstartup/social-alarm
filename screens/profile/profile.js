import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  DevSettings,
} from "react-native";
import { auth } from "../../firebase/firebase";
import { appStyles } from "../../style/stylesheet";
import { APPBACKGROUNDCOLOR } from "../../style/constants";

/* profile.js
 * Profile screen
 * contains sign out button
 */

export default function Profile() {
  // signOutUser - navigates user to login screen/stack, signs out user via firebase
  // i had navigation problems so now the app reloads and once it reloads it goes to auth
  signOutUser = async () => {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    //navigation.navigate("Auth");
    auth
      .signOut()
      .then(() => {
        // this reloads the page
        DevSettings.reload();
      })
      .catch((error) => console.log(error));
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
