import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GroupScreen from "../screens/groups/groups";
import AlarmScreen from '../screens/alarms/alarmsClass';
import ProfileScreen from "../screens/profile/profile";
//import ProfileScreen from "../screens/profile/test";
import StopwatchScreen from "../screens/stopwatch/stopwatch";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../style/constants';


/* navigation.js
 * bottom tab navigator for signed in user
 * contains: alarms, groups, stopwatch and profile
 *
 */

// This is code to create a bottom tab navigator
// Code from https://reactnavigation.org/docs/bottom-tab-navigator/
export default function Navigation() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <MyTabs />
    </NavigationContainer>
  );
}



const Tab = createBottomTabNavigator();

// Add more screens as necessary
function MyTabs() {
  return (
    <Tab.Navigator
      initialRoutename="Alarms" // After user signs in, go to alarms page
      tabBarOptions={{
        activeTintColor: APPTEXTRED, // This makes the button pink when you're on that page
        activeBackgroundColor: APPBACKGROUNDCOLOR,
        inactiveBackgroundColor: APPBACKGROUNDCOLOR,
      }}
    >
      <Tab.Screen
        name="Alarms"
        component={AlarmScreen}
        options={{
          tabBarLabel: "Alarms",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="alarm-multiple"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupScreen}
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} /> // Default color and size: white and 20
          ),
          //tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{
          tabBarLabel: "Stopwatch",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clock-fast"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
