import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import NavigationContainer from './screens/navigation';
import SignUp from './screens/signup';
import ForgotPassword from './screens/forgotPassword';
import Login from './screens/login';
import StackNavigator from './screens/stackNavigation'

export default class App extends React.Component {
  render()
  {
    return <StackNavigator />
    //return < SignUp />
    // return <ForgotPassword />
    // return <NavigationContainer/>
    //return < Login />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});