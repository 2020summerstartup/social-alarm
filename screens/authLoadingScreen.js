import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  //StyleSheet,
  View,
} from 'react-native';
/* authLoadingScreen.js
 * Auth loading screen
 * this is not used/does not work yet
 * it's supposed to be called when app opens so user can be automatically
 * signed in to their account via local storage
 * 
 * code from https://reactnavigation.org/docs/4.x/auth-flow (react navigation api docs example)
 * 
 */



class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');

    
  }; 

  // Render any loading content that you like here
  render() {
    return (
      <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;