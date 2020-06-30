import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationContainer from './screens/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});