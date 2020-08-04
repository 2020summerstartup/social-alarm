import React, { Component, useState } from 'react'
import { ScrollView, Switch, StyleSheet, Dimensions, Text, View, Linking, AsyncStorage, TouchableOpacity, DevSettings, Button } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { auth } from "../../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { profileStyles } from '../../style/stylesheet';

import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTBLUE} from '../../style/constants';

// chevron is the greater than sign that's on the right of everything on the profile page
import Chevron from './Chevron'

// sets the styles for all the icons
import BaseIcon from './Icon'

/* profile3.js
 * profile screen 
 * has push notifications, birthday, time zone, about us,  
 * share our app, and send feedback
 * feel free to change or delete any of these 
 */


const BirthdayPicker = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    console.log(date.toString());
  };

  return (
    <View>
      <Button title="Select birthday" onPress={showDatePicker}/>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date(1950, 0, 1)}
        maximumDate={new Date(2020, 11, 31)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        style={profileStyles.birthdayBtn}
        headerTextIOS={"When's your birthday?"}
      />
    </View>
  );
};

class ProfileScreen extends Component {

  // sign out functionality 
  signOutUser = async () => {
     await AsyncStorage.removeItem("email");
     await AsyncStorage.removeItem("password");
     //navigation.navigate("Auth");
     auth
       .signOut()
       .then(() => {
         // this reloads the page
         DevSettings.reload();
       })
       .catch((error) => console.log(error));
   };
  
  componentDidMount() {
    this.getEmailName();
  }

  // gets user email and name from async storage
  getEmailName = async () => {
    const userEmail = await AsyncStorage.getItem("email"); 
    const userName = await AsyncStorage.getItem("name");
    this.setState({name: userName});
    this.setState({email: userEmail});
  }

  constructor(props) {
    super(props);

    this.state = {
      switchValue: false,
      name: "", // this is the user's name
      email: "", // this is the user's email
      timeZoneSelected: "",
      timezoneArray: [
        { label: 'AST', value: 'AST' },
        { label: 'EST', value: 'EST' },
        { label: 'CST', value: 'CST' },
        { label: 'MST', value: 'MST' },
        { label: 'PST', value: 'PST' },
        { label: 'AKST', value: 'AKST' },
        { label: 'HST', value: 'HST' },
      ]
    };
  }

  toggleSwitch = value => {
    this.setState({ switchValue: value });
  };

  render() {

    return (
      <ScrollView style={profileStyles.scroll}>  
        {/* this part shows the user's name and email */}
        <View style={profileStyles.userRow}>
          <View>
            <Text style={{ fontSize: 30, color: APPTEXTBLUE }}>{this.state.name}</Text>
            <Text
              style={{
                color: APPTEXTBLUE,
                fontSize: 25,
              }}
            >
              {this.state.email} 
            </Text>
          </View>
        </View>

        <View>
          <ListItem
            hideChevron
            title="Dark Mode"
            containerStyle={profileStyles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FFADF2',
                }}
                icon={{
                  type: 'ionicon',
                  name: 'ios-moon',
                }}
              />
            }
          />
          <ListItem
            title="Birthday"
            rightTitleStyle={{ fontSize: 18 }}
            rightElement={<BirthdayPicker/>}    
            containerStyle={profileStyles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FAD291' }}
                icon={{
                  type: 'material',
                  name: 'cake',
                }}
              />
            }
          />
          <ListItem
            title="Time Zone"
            rightElement={
              <RNPickerSelect
                onValueChange={(value) => this.setState({ timeZoneSelected: value })}
                items={this.state.timezoneArray}

                // Object to overide the default text placeholder for the PickerSelect
                placeholder={{label: 'Select timezone', value: 'select timezone'}}
                style={
                  { fontWeight: 'normal',
                    color: 'black',
                    placeholder: {
                      color: "black",
                      fontSize: 18,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 8,
                    },
                    inputIOS: {
                      color: "black",
                      fontSize: 18,
                      marginRight: 12,
                      marginTop: 8,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  }
                }
                doneText={"Select"}                 
              />
            }
            rightTitleStyle={{ fontSize: 15 }}
            containerStyle={profileStyles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#57DCE7' }}
                icon={{
                  type: 'font-awesome',
                  name: 'globe',
                }}
              />
            }
          />
        </View>
        <View>
          <ListItem
            title="About Us"
            containerStyle={profileStyles.listItemContainer}
            onPress={ ()=>{ Linking.openURL('https://www.github.com/2020summerstartup/social-alarm')}} // we can change this later 
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#A4C8F0' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-information-circle',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Share our App"
            onPress={ ()=>{ Linking.openURL('https://www.github.com/2020summerstartup/social-alarm')}}
            containerStyle={profileStyles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#C47EFF',
                }}
                icon={{
                  type: 'entypo',
                  name: 'share',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Send Feedback"
            onPress={ ()=>{ Linking.openURL('https://www.github.com/2020summerstartup/social-alarm')}}
            containerStyle={profileStyles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#00C001',
                }}
                icon={{
                  type: 'materialicon',
                  name: 'feedback',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        
        {/* Sign out button */}
        <TouchableOpacity
          style={profileStyles.loginBtn}
          onPress={() => this.signOutUser()}
        >
          <Text style={profileStyles.logo}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default ProfileScreen