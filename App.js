import React from "react";
import SwitchNavigator from "./navigation/switchNavigation";
import NotificationContextProvider from "./contexts/NotificationContext";
import { View } from "react-native";
import ThemeContextProvider from "./contexts/ThemeContext";

/* Color codes from coolors.co 
Oxford Blue #0B132B
Little Boy Blue #71A9F7
Orange Red Crayola #FB5B5A
Purple Navy #465881
Blue Yonder #566C9F
*/

export default class App extends React.Component {
  render() {
    return (
      <ThemeContextProvider>
        <NotificationContextProvider>
          <SwitchNavigator />
        </NotificationContextProvider>
      </ThemeContextProvider>
    );
  }
}
