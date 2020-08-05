import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { APPBACKGROUNDCOLOR, APPTEXTRED } from "../style/constants";

import Login from "../screens/authentication/login";
import SignUp from "../screens/authentication/signup";
import ForgotPassword from "../screens/authentication/forgotPassword";
import Landing from "../screens/landing/landingCarousel";

/* stackNavigation.js
 * stack navigator for not signed in user
 * contains: login, sign up, forgot password
 * login is main page, has buttons that go to sign up and forgot password
 *
 */

const HomeStack = createStackNavigator(
  {
    Landing: {
      screen: Landing,
      navigationOptions: {
        title: "",
        headerShown: false
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: "Login",
      },
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "Sign Up",
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
      headerStyle: { backgroundColor: APPBACKGROUNDCOLOR, height: 60 },
      headerTintColor: APPTEXTRED,
    },
  }
);

const StackNavigator = createAppContainer(HomeStack);

export default StackNavigator;
