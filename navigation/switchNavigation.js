import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AuthLoadingScreen from "../screens/authentication/authLoadingScreen";
import StackNavigator from "./stackNavigation";
import Navigator from "./navigation";

/* switchNavigation.js
 * Switch navigation - controlls navigation after user logs in/signs out
 * TODO: get aith loading screen to work
 *
 */

const SwitchNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: StackNavigator,
      App: Navigator,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);

export default SwitchNavigator;
