import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ProgressViewIOS } from 'react-native';
import {APPTEXTRED, APPTEXTBLUE, APPBACKGROUNDCOLOR, APPTEXTWHITE} from "../../style/constants";


export default function Landing({ navigation })  
{
    onPressStart = () => {
        navigation.navigate("SignUp");
    };
    
    return (
        <View style={styles.container}>
        <View style={styles.topContainer}>
            <Text style={styles.h1}>Alarmium</Text>
            <Text style={styles.h2}>
            Stay connected with your friends with group alarms!
            </Text>
        </View>
        {/* <View style={styles.middleContainer}>
            <Image source={Logo} style={styles.image} />
        </View> */}
        <ProgressViewIOS number={1} />
        <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
            <Button
                title="LET'S START"
                style={styles.button}
                onPress={() => this.onPressStart()}
                color={APPTEXTWHITE}
            />
            </View>
        </View>
        </View>
    );
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: APPBACKGROUNDCOLOR,
      alignItems: 'center',
      width: '100%',
    },
    h1: {
      color: APPTEXTRED,
      fontWeight: "bold",
      fontSize: 40,
      
    },
    h2: {
      color: APPTEXTBLUE,
      fontSize: 18,
      marginTop: 8,
    },
    buttonContainer: {
        backgroundColor: APPTEXTRED,
        borderRadius: 5,
        padding: 8,
        margin: 8,
    },
    topContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottomContainer: {
        justifyContent: 'flex-end',
        width: '90%',
        margin: 20,
        padding: 10,
    },
  });