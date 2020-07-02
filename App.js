
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationContainer from './screens/navigation';
import SignUp from './screens/signup';
import ForgotPassword from './screens/forgotPassword';
import Login from './screens/login';
import StackNavigator from './screens/stackNavigation'
import SwitchNavigator from './screens/switchNavigation';

/* Color codes from coolors.co 
Oxford Blue #0B132B
Little Boy Blue #71A9F7
Orange Red Crayola #FB5B5A
Purple Navy #465881
Blue Yonder #566C9F
*/

export default class App extends React.Component {
  render()
  {
    return <SwitchNavigator />
    //return <StackNavigator />
    //return < SignUp />
    // return <ForgotPassword />
    // return <NavigationContainer/>
    //return <NavigationContainer/>
    //return < Login />

  }
}


