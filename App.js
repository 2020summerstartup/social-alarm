import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/home';
import AlarmScreen from './screens/alarms';
import ProfileScreen from './screens/profile';
import { NavigationContainer } from '@react-navigation/native';

// Part of the code needed to make a stack navigator
/*export default class App extends React.Component 
{
  render() {
    return <AppContainer />;
  }
}*/

// This is code to create a bottom tab navigator 
// Code from https://reactnavigation.org/docs/bottom-tab-navigator/
export default function App()
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
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Alarms"
        component={AlarmScreen}
        options={{
          tabBarLabel: 'Alarms',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
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

// This code is for a stack navigator
// Buttons go to and from the screens
/*const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },

  Alarm: {
    screen: AlarmScreen
  },

  Profile: {
    screen: ProfileScreen
  }
});

const AppContainer = createAppContainer(AppNavigator);*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});