import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GroupScreen from "../screens/groups/groups";
import AlarmScreen from '../screens/alarms/alarmsClass';
import ProfileScreen from "../screens/profile/profile";
import { NavigationContainer } from "@react-navigation/native";
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../style/constants';
import { NotificationContext }  from "../contexts/NotificationContext";
import {db, auth} from "../firebase/firebase";

/* navigation.js
 * bottom tab navigator for signed in user
 * contains: alarms, groups and profile
 *
 */

// This is code to create a bottom tab navigator
// Code from https://reactnavigation.org/docs/bottom-tab-navigator/
export default function Navigation() {

  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}


const Tab = createBottomTabNavigator();


// Add more screens as necessary
function MyTabs() {

  useEffect(()=> {

    initializeNotifications()

  })

  return (

    <NotificationContext.Consumer>{(context) => {
      
      const {notificationCount, setNotificationCount, isDarkMode, light, dark} = context

      const theme = isDarkMode ? dark : light

      initializeNotifications = () => {
        db.collection("users").doc(auth.currentUser.email).get().then((doc) => {
          setNotificationCount(doc.data().alertQueue.length.toString())
        })
      }


      return(


    <Tab.Navigator
    initialRoutename="Alarms" // After user signs in, go to alarms page
    tabBarOptions={{
      activeTintColor: theme.APPTEXTRED, // This makes the button pink when you're on that page
      activeBackgroundColor: theme.APPBACKGROUNDCOLOR,
      inactiveBackgroundColor: theme.APPBACKGROUNDCOLOR,
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
{/*
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
    */}

    {notificationCount > 0 && (
      <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        
        tabBarBadge: notificationCount,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
    )}

    {notificationCount <= 0 && (

      <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
    )}

    
    
  </Tab.Navigator>



      )
    }}
    
    </NotificationContext.Consumer>


  );
}
