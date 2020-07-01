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
            headerStyle: { backgroundColor: '#eee', height: 60, },
            headerTintColor: '#444',
        }
    }
)

const StackNavigator = createAppContainer(HomeStack);

export default StackNavigator;