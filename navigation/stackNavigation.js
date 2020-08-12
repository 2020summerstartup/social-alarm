import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE } from "../style/constants";

import Login from "../screens/authentication/login";
import SignUp from "../screens/authentication/signup";
import ForgotPassword from "../screens/authentication/forgotPassword";
import Landing from "../screens/landing/landingCarousel";

/* stackNavigation.js
 * stack navigator for not signed in user
 * contains: landing, login, sign up, forgot password
 * landing is main page, has buttons that go to sign up and login
 *
 * landing is default page
 *
 */

const HomeStack = createStackNavigator(
  {
    Landing: {
      screen: Landing,
      navigationOptions: {
        title: "",
        headerShown: false,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: "",
      },
    },
    SignUp: {
      screen: SignUp,
      navigationOptions: {
        title: "",
      },
    },
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: {
        title: "",
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: { backgroundColor: APPBACKGROUNDCOLOR, height: 60 },
      headerTintColor: APPTEXTWHITE,
      headerTransparent: true,
    },
  }
);

const StackNavigator = createAppContainer(HomeStack);

export default StackNavigator;
