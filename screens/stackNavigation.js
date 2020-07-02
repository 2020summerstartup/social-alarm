import { createAppContainer } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Login from "./login";
import SignUp from "./signup";
import ForgotPassword from './forgotPassword';
import React from 'react';

const HomeStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: { 
            title: 'Login',
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: { 
            title: 'SignUp',
        },

    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: { 
            title: 'Forgot Password',
        },

    }

}, {
        defaultNavigationOptions: {
            headerStyle: { backgroundColor: '#003f5c', height: 60, },
            headerTintColor: "#fb5b5a",
        }
    }
)

const StackNavigator = createAppContainer(HomeStack);

export default StackNavigator;