import React from "react";
import SwitchNavigator from "./navigation/switchNavigation";

/* Color codes from coolors.co 
Oxford Blue #0B132B
Little Boy Blue #71A9F7
Orange Red Crayola #FB5B5A
Purple Navy #465881
Blue Yonder #566C9F
*/

export default class App extends React.Component {
  render() {
    return <SwitchNavigator />;
    //return <AuthLoadingScreen />;
    //return <StackNavigator />
    //return < SignUp />
    // return <ForgotPassword />
    //return <NavigationContainer/>
    //return < Login />
  }
}
