import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView,
  StyleSheet, 
  Button } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE, APPTEXTBLUE } from '../../style/constants';

export default class App extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              title:"Alarmium",
              text: "Stay connected with your friends with group alarms!",
          },
          {
              title:"Set alarms!",
              text: "Click the plus icon to set an alarm with a custom name.",
          },
          {
              title:"Create groups!",
              text: "Click the plus icon to create a group with a custon name. Add your friends too!",
          },
        ]
      }
    }

    _renderItem({item,index}){
        return (
          <View style={{
              backgroundColor:APPTEXTRED,
              borderRadius: 5,
              height: 550,
              padding: 50,
              marginLeft: 40,
              marginRight: 25, }}>
            <Text style={{fontSize: 35, fontWeight: "bold", color: APPTEXTWHITE, justifyContent: "center"}}>{item.title}</Text>
            <Text style={{fontSize: 20, color: APPTEXTBLUE}}>{item.text}</Text>
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
                  activeSlideOffset={2}
                  data={this.state.carouselItems}
                  sliderWidth={0.2}
                  itemWidth={400}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>

            <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
            <Button
                title="LET'S START"
                style={styles.button}
                //onPress={() => this.onPressStart()}
                color={APPTEXTWHITE}
            />
            </View>
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
        margin: 8,
    },
    bottomContainer: {
        justifyContent: 'flex-end',
        width: '90%',
        margin: 20,
        padding: 10,
    },
  });

