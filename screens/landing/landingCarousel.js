/* landingCarousel.js
 * landing screen
 * navigates to sign up and login
 *
 */

import React, { Component } from 'react';
import {
  Text, 
  View,
  SafeAreaView,
  StyleSheet, 
  Button,
  Image } from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import { APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE, APPTEXTBLUE } from '../../style/constants';

// the three pictures for the three screens
import alarmpage from "../../assets/alarmpage2.jpg";
import logo from "../../assets/logo_landing.png";
import grouppage from "../../assets/grouppage2.jpg";

export default class Landing extends Component{

    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              // First Screen
              title:"TeamTime",
              text: "Stay connected with your friends by setting alarms for each other!",
              image: logo
          },
          {
              // Second Screen
              title:"Set alarms!",
              text: "Click the + icon to set an alarm with a custom name.",
              image: alarmpage
          },
          {
              // Third Screen
              title:"Create groups!",
              text: "Create as many groups as you want and add your friends too!",
              image: grouppage
          },
        ]
      }
    }

    // dots underneath the carousel
    get pagination () {
        return (
            <Pagination
              dotsLength={this.state.carouselItems.length}
              activeDotIndex={this.state.activeIndex}
              animatedTension={20}
              animatedFriction={2}
              animatedDuration={5}
              containerStyle={{ backgroundColor: APPBACKGROUNDCOLOR, width: 200, marginLeft: 100, height: 62 }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 8,
                  marginHorizontal: 4,
                  backgroundColor: "black"
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    _renderItem({item,index}){
        return (
          // shows the title, text and image of each item in the carousel
          <View style={{
              backgroundColor:APPTEXTRED,
              borderRadius: 25,
              height: 500,
              padding: 12,
              marginLeft: 38,
              marginTop: 15,
              marginRight: 25, }}>
            <Text style={{fontSize: 48, fontWeight: "bold", color: APPTEXTWHITE, textAlign: "center", paddingTop: 13}}>{item.title}</Text>
            <Image
                source={item.image}
                style={styles.image}
            />  
            <Text style={{fontSize: 23, color: APPTEXTBLUE, textAlign: "center"}}>{item.text}</Text>      
          </View>

        )
    }

    render() {
        return (
          <SafeAreaView style={{flex: 1, backgroundColor:APPBACKGROUNDCOLOR, paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  ref={ref => this.carousel = ref}
                  activeSlideOffset={0.2}
                  data={this.state.carouselItems}
                  sliderWidth={0.02}
                  itemWidth={400}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>

            {/* three dots */}
            { this.pagination }

            <View style={styles.bottomContainer}>

            <View style={styles.buttonContainer}>
              <Button
                  title="LET'S START"
                  style={styles.button}
                  onPress={() => this.props.navigation.navigate("SignUp")} // this button navigates to sign up
                  color={APPTEXTWHITE}
              />
            </View>

            <Button
                title="Login"
                style={styles.loginBtn}
                onPress={() => this.props.navigation.navigate("Login")} // this button navigates to login
                color={APPTEXTBLUE}
            />
            </View>
          </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: APPBACKGROUNDCOLOR,
      alignItems: 'center',
      width: '100%',
    },
    buttonContainer: {
        backgroundColor: APPTEXTRED,
        borderRadius: 5,
        padding: 8,
    },
    loginBtn: {
        backgroundColor: APPTEXTWHITE,
    },
    bottomContainer: {
        justifyContent: 'flex-end',
        width: '80%',
        marginLeft: 40,
        padding: 10,
    },
    image: {
      width: 310,
      height: 350,
      marginLeft: 0,
      marginTop: 10,
      justifyContent: 'center',
    },
  });

