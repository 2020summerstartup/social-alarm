import React, { Component, useState } from "react";
import {
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  View,
  Linking,
  AsyncStorage,
  TouchableOpacity,
  DevSettings,
  Button,
  Modal,
  TouchableHighlight,
  RefreshControl
} from "react-native";
import { ListItem, withBadge } from "react-native-elements";
import { auth, db } from "../../firebase/firebase";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import { profileStyles } from "../../style/stylesheet";

import { MaterialIcons } from "@expo/vector-icons";

import { appStyles } from "../../style/stylesheet";

import {
  APPBACKGROUNDCOLOR,
  APPTEXTRED,
  APPTEXTBLUE,
  APPTEXTWHITE,
  APPINPUTVIEW,
} from "../../style/constants";

// chevron is the greater than sign that's on the right of everything on the profile page
import Chevron from "./Chevron";

// sets the styles for all the icons
import BaseIcon from "./Icon";
import { NotificationContext } from "../../contexts/NotificationContext";
import { color } from "react-native-reanimated";

/* profile3.js
 * profile screen
 * has notifications, birthday, time zone, about us,
 * share our app, and send feedback
 * feel free to change or delete any of these
 */

// This is for the birthday picker
const BirthdayPicker = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // shows the date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // TO DO: replace the "select birthday" button title with the date
  const handleConfirm = (date) => {
    hideDatePicker();
    // console.log(date.toString());
  };

  return (
    <View>
      <Button title="Select birthday" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date(1900, 0, 1)}
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
    // remove auth credentials from local storage
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    //sign user out with firebase
    auth
      .signOut()
      .then(() => {
        // this reloads the page
        // TODO: try to get navigation to work again?
        // I couldn't get navigation stuff to work so instead
        // we're reloading the page and then it will display the
        // auth screen
        DevSettings.reload();
      })
      .catch((error) => console.log(error));
  };

  componentDidMount() {
    // gets user's email and name from AsyncStorage
    this.getEmailName();
    this.getTimeZone();
    // gets notifications from firebase and stores them in state
    this.getNotifications();
    
  }

  // gets user email and name from async storage
  getEmailName = async () => {
    const userEmail = await AsyncStorage.getItem("email");
    const userName = await AsyncStorage.getItem("name");
    this.setState({ name: userName });
    this.setState({ email: userEmail });
  };

  // gets time zone from local storage
  getTimeZone = async () => {
    const timeZone = await AsyncStorage.getItem("timezone");
    this.setState({ timeZoneSelected: timeZone });
  }
  // saves time zone in local storage
  setTimeZone = async (timezone) => {
    await AsyncStorage.setItem("timezone", timezone);
  }

  constructor(props) {
    super(props);

    this.state = {
      name: "", // this is the user's name
      email: "", // this is the user's email

      notificationsModal: false, // controls if the notifications modal  is open
      notifications: [], // all the notifications from firebase

      refresh: false,

      timeZoneSelected: "",
      timezoneArray: [
	      { label: 'Eastern Time', value: 'EST' },
        { label: 'Central Time', value: 'CST' },
        { label: 'Mountain Time', value: 'MST' },
        { label: 'Pacific Time', value: 'PST' },	  
      ]	      
    };
  }

  // context (global state) stuff
  static contextType = NotificationContext;

  // called in componentDidMount
  // stores notifications from firebase in state
  getNotifications = () => {
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        this.setState({ notifications: doc.data().notifications });
      });
  };

  // called when user closes notification modal
  // closes  modal and deletes notififcations from firebase
  closeNotifications = () => {
    this.setState({ notificationsModal: false });
    db.collection("users").doc(auth.currentUser.email).update({
      notifications: [],
    });
  };

  render() {
    // context (global state) stuff
    const {
      notificationCount,
      setNotificationCount,
      isDarkMode,
      toggleTheme,
      light,
      dark,
    } = this.context;

    const theme = isDarkMode ? dark : light;

    // called when user opens notifications modal
    // opens modal and sets global state notification count to 0
    openNotifications = () => {
      this.setState({ notificationsModal: true });
      setNotificationCount(0);
    };

    // called when user toggles theme button
    // stores new theme in AsyncStorage and toggles theme
    changeTheme = async () => {
      // themes are switched bc they are toggled after this
      AsyncStorage.setItem("theme", isDarkMode ? "light" : "dark");
      await toggleTheme();
    };

    // this allows notifications icon to have a lil badge when there are notifications
    // https://react-native-elements.github.io/react-native-elements/docs/badge#withbadge-higher-order-component
    const BadgedIcon = withBadge(notificationCount)(BaseIcon);

    return (

      <View style={{...profileStyles.container, backgroundColor: theme.APPBACKGROUNDCOLOR}}>
        {/* this part shows the user's name and email */}
        <View style={profileStyles.userRow}>
          <Text style={{ fontSize: 30, color: theme.APPTEXTBLACK }}>{/*this.state.name.replace ('<br/>', '\n')*/}
          </Text>
          <Text
            style={{
              color: theme.APPTEXTBLACK,
              fontSize: 25,
            }}
          >
            {this.state.email}
          </Text>
        </View>

      <ScrollView
        style={{
          ...profileStyles.scroll,
          backgroundColor: theme.APPBACKGROUNDCOLOR,
        }}
      >

        {/* NOTIFICATIONS MODAL */}
        <Modal visible={this.state.notificationsModal} animationType="slide">
          <View
            style={{
              alignItems: "center",
              flex: 1,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
          >
            <MaterialIcons
              name="close"
              size={24}
              style={{
                ...appStyles.modalClose,
                ...appStyles.modalToggle,
                ...{ margin: 20, color: theme.APPTEXTRED },
              }}
              color={theme.APPTEXTRED}
              onPress={() => this.closeNotifications()}
            />

            <Text
              style={{
                ...styles.logo,
                fontSize: 36,
                color: theme.APPTEXTRED,
              }}
            >Notifications</Text>

            

            
            <ScrollView 
            style={{ width: "95%" }}
            refreshControl={
              <RefreshControl refreshing={this.state.refresh} 
              onRefresh={this.getNotifications.bind(this)} tintColor={theme.APPTEXTBLACK}
              />
            }
            >

            {/* if there are no new notifications */}
            {this.state.notifications.length == 0 && (
              <View style={{alignItems: "center"}}>
              <Text
                style={{
                  ...styles.logo,
                  fontSize: 22,
                  fontWeight: "normal",
                  paddingTop: 30,
                  color: theme.APPTEXTRED,
                }}
              >
                You have no new notifications
              </Text>
              </View>
            )}
            
            {/* if there are new notifications */}
              {this.state.notifications &&
                this.state.notifications.map((notification) => {
                  return (
                    <TouchableHighlight
                      style={{
                        ...styles.alarmBanner,
                        backgroundColor: theme.APPTEXTRED,
                      }}
                      key={notification.body}
                    >
                      <View>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={{
                            ...styles.titleText,
                            color: theme.APPTEXTWHITE,
                          }}
                        >
                          {notification.title}
                        </Text>
                        <Text
                          style={{
                            ...styles.bodyText,
                            color: theme.APPTEXTWHITE,
                          }}
                        >
                          {notification.body}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  );
                })}
            </ScrollView>
          </View>
        </Modal>

        <View>
          {/* NOTIFICATION ICON ON MAIN PAGE */}
          {/* if there are no new notifications - no badge */}
          {notificationCount == 0 && (
            <ListItem
              title="Notifications"
              containerStyle={{
                ...profileStyles.listItemContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
              titleStyle={{ color: theme.APPTEXTBLACK }}
              onPress={() => openNotifications()}
              leftIcon={
                <BaseIcon
                  containerStyle={{ backgroundColor: APPTEXTRED }}
                  icon={{
                    type: "ionicon",
                    name: "ios-notifications",
                  }}
                />
              }
              rightIcon={<Chevron />}
            />
          )}
          {/* if there are new notifications - show badge */}
          {notificationCount > 0 && (
            <ListItem
              title="Notifications"
              containerStyle={{
                ...profileStyles.listItemContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
              titleStyle={{ color: theme.APPTEXTBLACK }}
              onPress={() => openNotifications()}
              leftIcon={
                <BadgedIcon
                  containerStyle={{ backgroundColor: APPTEXTRED }}
                  icon={{
                    type: "ionicon",
                    name: "ios-notifications",
                  }}
                />
              }
              rightIcon={<Chevron />}
            />
          )}

          {/* DARK MODE ICON */}
          <ListItem
            hideChevron
            title="Dark Mode"
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            rightElement={
              <Switch onValueChange={() => changeTheme()} value={isDarkMode} />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: "#A4C8F0",
                }}
                icon={{
                  type: "ionicon",
                  name: "ios-moon",
                }}
              />
            }
          />

          {/* BIRTHDAY ICON */}
          <ListItem
            title="Birthday"
            rightTitleStyle={{ fontSize: 18 }}
            rightElement={<BirthdayPicker />}
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: "#FAD291" }}
                icon={{
                  type: "material",
                  name: "cake",
                }}
              />
            }
          />

          {/* TIMEZONE ICON */}
          <ListItem
            title="Time Zone"
            rightElement={
              <RNPickerSelect
                onValueChange={(value) =>
                  {this.setState({ timeZoneSelected: value });
                  this.setTimeZone(value)}
                }	                      
                items={this.state.timezoneArray}
                // Object to overide the default text placeholder for the PickerSelect
                placeholder={{
                  label: "Select timezone",
                  value: "select timezone",
                }}
                style={{
                  fontWeight: "normal",
                  color: theme.APPTEXTBLACK,
                  placeholder: {
                    color: theme.APPTEXTBLACK,
                    fontSize: 18,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 8,
                  },
                  inputIOS: {
                    color: theme.APPTEXTBLACK,
                    fontSize: 18,
                    marginRight: 12,
                    marginTop: 8,
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
                doneText={"Select"}
                value={this.state.timeZoneSelected}
              />
            }
            rightTitleStyle={{ fontSize: 15 }}
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: "#57DCE7" }}
                icon={{
                  type: "font-awesome",
                  name: "globe",
                }}
              />
            }
          />
        </View>
        <View>
          {/* ABOUT US ICON */}
          <ListItem
            title="About Us"
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            onPress={() => {
              Linking.openURL(
                "https://www.github.com/2020summerstartup/social-alarm"
              );
            }} // we can change this later
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: "#FFADF2" }}
                icon={{
                  type: "ionicon",
                  name: "md-information-circle",
                }}
              />
            }
            rightIcon={<Chevron />}
          />

          {/* SHARE OUR APP ICON */}
          <ListItem
            title="Share our App"
            onPress={() => {
              Linking.openURL(
                "https://www.github.com/2020summerstartup/social-alarm"
              );
            }}
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: "#C47EFF",
                }}
                icon={{
                  type: "entypo",
                  name: "share",
                }}
              />
            }
            rightIcon={<Chevron />}
          />

          {/* SEND FEEDBACK ICON */}
          <ListItem
            title="Send Feedback"
            onPress={() => {
              Linking.openURL(
                "https://www.github.com/2020summerstartup/social-alarm"
              );
            }}
            containerStyle={{
              ...profileStyles.listItemContainer,
              backgroundColor: theme.APPBACKGROUNDCOLOR,
            }}
            titleStyle={{ color: theme.APPTEXTBLACK }}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: "#00C001",
                }}
                icon={{
                  type: "materialicon",
                  name: "feedback",
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
      </ScrollView>

      
        {/* Sign out button */}
        <TouchableOpacity
          style={{...profileStyles.loginBtn, backgroundColor: theme.APPTEXTRED}}
          onPress={() => this.signOutUser()}
        >
          <Text style={profileStyles.logo}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPTEXTRED,
    marginBottom: 5,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  // the banner
  alarmBanner: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: APPTEXTRED,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    borderRadius: 15,
  },

  // lol bad name - the button text
  titleText: {
    color: APPTEXTWHITE,
    fontSize: 22,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingVertical: 5,
  },

  // text in indiv group modal - members
  bodyText: {
    color: APPTEXTWHITE,
    fontSize: 18,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
  },
});