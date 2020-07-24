import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Login from "../screens/authentication/login";
import SignUp from "../screens/authentication/signup";
import ForgotPassword from "../screens/authentication/forgotPassword";

/* stackNavigation.js
 * stack navigator for not signed in user
 * contains: login, sign up, forgot password
 * login is main page, has buttons that go to sign up and forgot password
 *
 */

const HomeStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        title: "Login",
      },
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "SignUp",
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        title: "Forgot Password",
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: "#003f5c", height: 60 },
      headerTintColor: "#fb5b5a",
    },
  }
);

const StackNavigator = createAppContainer(HomeStack);

export default StackNavigator;
