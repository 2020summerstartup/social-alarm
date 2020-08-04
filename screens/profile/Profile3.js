import React, { Component, useState } from 'react'
import { ScrollView, Switch, StyleSheet, Dimensions, Text, View, Linking, AsyncStorage, TouchableOpacity, DevSettings, Button } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { auth } from "../../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTBLUE} from '../../style/constants';

// chevron is the greater than sign that's on the right of everything on the profile page
import Chevron from './Chevron'

// sets the styles for all the icons
import BaseIcon from './Icon'

/* profile3.js
 * profile screen 
 * has push notifications, birthday, time zone, language, about us,  
 * share our app, and send feedback
 * feel free to change or delete any of these 
 */

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',

    // these lines fit the container to the entire screen
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 80,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 80,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 60,
    borderWidth: 0.5,
    borderColor: APPBACKGROUNDCOLOR,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPBACKGROUNDCOLOR,
    marginBottom: 5,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  loginBtn: {
    width: "80%",
    backgroundColor: APPTEXTRED,
    borderRadius: 15,
    height: 40,
    marginLeft: 20,
    width: 0.85 * Dimensions.get('screen').width, // sign out button is 90% of the screen's width
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 30,
  },
  birthdayBtn: {
    width: "80%",
    height: 50,
    marginLeft: 20,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 30,
  },
})

/* this code was for dark mode, currently not working, delete?
const ThemeContext = React.createContext(null);
const ThemeConstants = {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
  },
  dark: {
    backgroundColor: '#000',
    fontColor: '#fff',
  },
};

class ThemedButton extends React.Component {
  render() {
    let { title, ...props } = this.props;
    return (
      <TouchableOpacity {...props}>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <Text style={{ color: ThemeConstants[theme].fontColor }}>
              {title}
            </Text>
          )}
        </ThemeContext.Consumer>
      </TouchableOpacity>
    );
  }
}

class ThemedView extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <View
            {...this.props}
            style={[
              this.props.style,
              { backgroundColor: ThemeConstants[theme].backgroundColor },
            ]}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}
*/

const BirthdayPicker = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const onPressButton = () => {
    this.setState({
        textValue: 'Text has been changed'
    })
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    showDate(date);
  };

  const showDate = (date) => {
    <Text>{date}</Text>
  }

  return (
    <View>
      <Button title="Select" onPress={showDatePicker}/>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date(1950, 0, 1)}
        maximumDate={new Date(2020, 11, 31)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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
      darkTheme: false,
      name: "", // this is the user's name
      email: "", // this is the user's email
      theme: 'light',
    };
  }

  toggleTheme = () => {
    this.setState(({ theme }) => ({
      theme: theme === 'light' ? 'dark' : 'light',
    }));
  };

  render() {

    return (
      <ScrollView style={styles.scroll}>  
        {/* this part shows the user's name and email */}
        <View style={styles.userRow}>
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
          {/* dark mode code - doesn't work rn */}
          {/*<ThemedView
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ThemeContext.Consumer>
              {({ toggleTheme }) => (
                <ThemedButton title="Toggle theme" onPress={toggleTheme} />
              )}
            </ThemeContext.Consumer>
              </ThemedView>*/}
          <ListItem
            hideChevron
            title="Dark Mode"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={this.onChangeDarkTheme}
                value={this.state.darkTheme}
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
            rightTitleStyle={{ fontSize: 15 }}
            rightElement={<BirthdayPicker/>}         
            containerStyle={styles.listItemContainer}
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
            rightTitle="PST" // TO DO: add time zone picker or a text box here
            rightTitleStyle={{ fontSize: 15 }}
            containerStyle={styles.listItemContainer}
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
            containerStyle={styles.listItemContainer}
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
            containerStyle={styles.listItemContainer}
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
            containerStyle={styles.listItemContainer}
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
          style={styles.loginBtn}
          onPress={() => this.signOutUser()}
        >
          <Text style={styles.logo}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default ProfileScreen