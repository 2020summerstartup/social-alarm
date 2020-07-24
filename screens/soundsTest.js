// https://www.youtube.com/watch?v=HCvp2fZh--A

import React, { Component } from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { Audio } from 'expo-av';

export default class App extends Component {

    async componentDidMount() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndriod: Audio.INTERRUPTION_MODE_ANDRIOD_DUCK_OTHERS,
            shouldDuckAndriod: true, 
            staysActiveInBackground: true,
            playsThroughEarpieceAndriod: true
        });

        this.sound = new Audio.Sound();

        const status = {
            shouldPlay: false,
        };

        this.sound.loadAsync(require('../sounds/piano1.wav'), status, false);
    }
    playSound() {
        this.sound.playAsync();
    }

    render() {
        return(
            <View style={styles.container}>
                <Button
                    title = "Play Sound"
                    color = "black"
                    onPress={this.playSound.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
    }
})