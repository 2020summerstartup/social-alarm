import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  StyleSheet,
  Appearance,
} from "react-native";
import { auth } from "../../firebase/firebase";
import { NotificationContext } from "../../contexts/NotificationContext";

/* authLoadingScreen.js
 * Auth loading screen
 * it's called when app opens so user can be automatically
 * signed in to their account via local storage
 *
 * code from https://reactnavigation.org/docs/4.x/auth-flow (react navigation api docs example)
 *
 */

class AuthLoadingScreen extends React.Component {
  static contextType = NotificationContext;

  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var self = this;
    const userToken = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");
    const theme = await AsyncStorage.getItem("theme");
    const { isDarkMode, toggleTheme } = this.context;

    if (userToken && password) {
      if (
        (theme == "dark" && !isDarkMode) ||
        (theme == "light" && isDarkMode)
      ) {
        toggleTheme();
      }
      auth
        .signInWithEmailAndPassword(userToken, password)
        .then(function (user) {
          self.props.navigation.navigate("App");
        });
    } else {
      // if user generally prefers dark mode - dark mode will be on
      const colorScheme = Appearance.getColorScheme();
      if (colorScheme === "dark") {
        toggleTheme();
      }
      // navigate to auth stuff
      this.props.navigation.navigate("Auth");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
