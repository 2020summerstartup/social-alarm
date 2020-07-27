import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Dimensions, Text, View, Linking, AsyncStorage } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import TimezonePicker from 'react-timezone-picker';

// TO DO: add our app colors to the profile page
import {APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE} from '../../style/constants';

// chevron is the greater than sign that's on the right of everything on the profile page
import Chevron from './chevron'

// sets the styles for all the icons
import BaseIcon from './icon'

/* profile3.js
 * profile screen 
 * has push notifications, birthday, time zone, language, about us, terms&policies, 
 * share our app, rate us and send feedback
 * feel free to change or delete any of these 
 */

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 60,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 60,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 56,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})

class ProfileScreen extends Component {

  componentDidMount() {
    this.getEmailName();
  }

  getEmailName = async () => {
  
    const userEmail = await AsyncStorage.getItem("email"); 
    const userName = await AsyncStorage.getItem("name");
    this.setState({name: userName});
    this.setState({email: userEmail});
  }

  constructor(props) {
    super(props);

    this.state = {
      pushNotifications: true,
      name: "",
      email: "",
    };
  }

  onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }))
  }

  render() {
    return (
      <ScrollView style={styles.scroll}>
        {/* TO DO: figure out if we want a profile picture & how to import it */}
        <View style={styles.userRow}>
          {/*<View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: avatar,
              }}
            />
            </View>*/}
          <View>
            <Text style={{ fontSize: 30, color: APPBACKGROUNDCOLOR }}>{this.state.name}</Text>
            <Text
              style={{
                color: APPBACKGROUNDCOLOR,
                fontSize: 25,
              }}
            >
              {this.state.email} {/* TO DO: figure out how to get name and email from firebase */}
            </Text>
          </View>
        </View>
        {/* Not really sure if we want this, was in the tutorial so I kept it, maybe change to sign out button? */}
        <View>
          <ListItem
            hideChevron
            title="Push Notifications"
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={this.onChangePushNotifications}
                value={this.state.pushNotifications}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FFADF2',
                }}
                icon={{
                  type: 'material',
                  name: 'notifications',
                }}
              />
            }
          />
          <ListItem
            title="Birthday"
            rightTitle="05/01/2001"  // TO DO: add text box or date picker here so users can pick their birthday
            rightTitleStyle={{ fontSize: 15 }}
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
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Time Zone"
            rightTitle="PST" // TO DO: add time zone picker here
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
            rightIcon={<Chevron />}
          />
          {/* Not really sure if we want this, was in the tutorial so I kept it */}
          <ListItem
            title="Language"
            rightTitle="English"
            rightTitleStyle={{ fontSize: 15 }}
            onPress={ ()=>{ Linking.openURL('https://www.google.com')}} // navigate to some website
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FEA8A1' }}
                icon={{
                  type: 'material',
                  name: 'language',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        {/*<InfoText text="More" />*/}
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
            title="Terms and Policies"
            onPress={ ()=>{ Linking.openURL('https://www.google.com')}}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C6C7C6' }}
                icon={{
                  type: 'entypo',
                  name: 'light-bulb',
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
            title="Rate Us"
            onPress={ ()=>{ Linking.openURL('https://www.google.com')}}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FECE44',
                }}
                icon={{
                  type: 'entypo',
                  name: 'star',
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
      </ScrollView>
    )
  }
}

export default ProfileScreen