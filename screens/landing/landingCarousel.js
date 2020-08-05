import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView,
  StyleSheet, 
  Button } from 'react-native';

import Carousel, {Pagination} from 'react-native-snap-carousel';
import { APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE, APPTEXTBLUE } from '../../style/constants';

// function Navigation({ navigation }) {
//     onPressStart = () => {
//         navigation.navigate("SignUp");
//       };
// }

export default class Landing extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          activeIndex:0,
          carouselItems: [
          {
              title:"Alarmium",
              text: "Stay connected with your friends by setting alarms for each other!",
          },
          {
              title:"Set alarms!",
              text: "Click the + icon to set an alarm with a custom name.",
          },
          {
              title:"Create groups!",
              text: "Click the + icon to create groups with custom names. Add your friends too!",
          },
        ]
      }
    }

    get pagination () {
        return (
            <Pagination
              dotsLength={this.state.carouselItems.length}
              activeDotIndex={this.state.activeIndex}
              containerStyle={{ backgroundColor: APPBACKGROUNDCOLOR, width: 200, marginLeft: 100, marginBottom: 2, marginTop: 2, height: 62 }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 4,
                  backgroundColor: "black"
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
    }

    _renderItem({item,index}){
        return (
          <View style={{
              backgroundColor:APPTEXTRED,
              borderRadius: 35,
              borderBottomEndRadius: 35,
              borderBottomStartRadius: 35,
              height: 500,
              padding: 50,
              marginLeft: 40,
              marginTop: 15,
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
                  activeSlideOffset={0.2}
                  data={this.state.carouselItems}
                  sliderWidth={0.02}
                  itemWidth={400}
                  renderItem={this._renderItem}
                  onSnapToItem = { index => this.setState({activeIndex:index}) } />
            </View>

            { this.pagination }

            <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
            <Button
                title="LET'S START"
                style={styles.button}
                // onPress={() => Navigation()}
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

