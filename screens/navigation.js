import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './login';
import AlarmScreen from './alarms';
import ProfileScreen from './profile';
import StopwatchScreen from './stopwatch';
import { NavigationContainer } from '@react-navigation/native';

// This is code to create a bottom tab navigator 
// Code from https://reactnavigation.org/docs/bottom-tab-navigator/
export default function Navigation()
{
  return (
    
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  )
}

const Tab = createBottomTabNavigator();

// Add more screens as necessary
function MyTabs() {
  return (
    <Tab.Navigator
      initialRoutename = "Home"
      tabBarOptions={{
        activeTintColor: "#fb5b5a", // This makes the button pink when you're on that page
        activeBackgroundColor: "#003f5c",
        inactiveBackgroundColor: "#003f5c",
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} /> // Default color and size: white and 20
          ),
          //tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name="Stopwatch"
        component={StopwatchScreen}
        options={{
          tabBarLabel: 'Stopwatch',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-fast" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alarms"
        component={AlarmScreen}
        options={{
          tabBarLabel: 'Alarms',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alarm-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />

      </Tab.Navigator>
  )
}