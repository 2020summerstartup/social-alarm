// home.js
import React, { Component, useState } from "react";
import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
// TODO: can i make this less things?? - possibly import the default fromfirebase file
// import * as firebase from "firebase";
import Firebase from "../../firebase/firebase";
import { db, auth } from "../../firebase/firebase";

import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import {
  APPBACKGROUNDCOLOR,
  APPTEXTRED,
  APPTEXTWHITE,
} from "../../style/constants";
import { appStyles, alarmStyles } from "../../style/stylesheet";

export default class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // modal states
      createModalOpen: false,
      groupModalOpen: false,
      // the text input box in create group modal
      groupName: "",
      // array of groups the user is in
      groups: [],
      // current user - doesn't change, idk why it's a state
      user: auth.currentUser,
      // info for group specific modal
      groupNameClicked: "",
      groupIdClicked: "",
      groupMembers: [],
      // the text input in add user field of group specific modal
      addUser: "",
    };
  }

  user = auth.currentUser;

  // called when user hits create group button in create group modal
  createGroup = (name, user) => {
    // if group length is too small - no group made, instead alert
    if (name.length < 3) {
      Alert.alert("Oops!", "Group name must be at least 3 characters long", [
        { text: "ok" },
      ]);
    } else {
      // add group to group collection with relevant info
      db.collection("groups")
        .add({
          groupName: name,
          adminId: user.uid,
          adminEmail: user.email,
          members: [user.email],
          alarms: [],
        })
        .then((docRef) => {
          // modal closes
          this.setState({ createModalOpen: false });

          // add group to user's doc
          db.collection("users")
            .doc(user.email)
            .update({
              groups: Firebase.firestore.FieldValue.arrayUnion({
                name: name,
                id: docRef.id,
              }),
            });
          //  update user's groups in state
          var groupData = [];
          for(var i = 0;  i < this.state.groups.length; i++) {
            groupData.push(this.state.groups[i]);
          }
          groupData.push({
            name: name,
            id: docRef.id,
            //key: this.state.groups.length + 1,
          });
          
          this.setState({ groups: groupData });
        })
        .catch(function (error) {
          console.log(error.toString());
        });
    }
  };

  // called when user presses one of the group buttons
  // opens group modal and sets it all  up
  groupModal = (groupName, groupId) => {
    // opens modal, stores some info in some state
    this.setState({ groupModalOpen: true });
    this.setState({ groupNameClicked: groupName });
    this.setState({ groupIdClicked: groupId });

    // groupId  might be a string or a doc reference, so it does something different for each case
    if (typeof groupId == "string") {
      // gets group members,  stores them in state
      db.collection("groups")
        .doc(groupId)
        .get()
        .then((doc) => {
          const groupMem = [];
          for (var i = 0; i < doc.data().members.length; i++) {
            groupMem.push(doc.data().members[i]);
          }
          this.setState({ groupMembers: groupMem });
        });
    } 
    /* else {
      // gets group members,  stores them in state
      db.collection("groups")
        .doc(groupId.id)
        .get()
        .then((doc) => {
          const groupMem = [];
          for (var i = 0; i < doc.data().members.length; i++) {
            groupMem.push(doc.data().members[i]);
          }
          this.setState({ groupMembers: groupMem });
        });
    } */
  };

  addUser = (userName, groupId) => {
    //  this is needed - talk to anna to explain more
    // https://stackoverflow.com/questions/39191001/setstate-with-firebase-promise-in-react
    var self = this;

    // find's user's doc
    db.collection("users")
      .doc(userName)
      .get()
      .then(function (doc) {
        // if that is a  real user in our system
        if (doc.exists) {
          db.collection("groups")
            .doc(groupId)
            .get()
            .then(function (doc2) {
              // if the user is not already in the group
              if (doc2.data().members.indexOf(userName) == -1) {
                // update user's document so it contains new group info
                db.collection("users")
                  .doc(userName)
                  .update({
                    groups: Firebase.firestore.FieldValue.arrayUnion({
                      name: doc2.data().groupName,
                      id: doc2.id,
                    }),
                  })
                  .then(function () {
                    // update group doc so it contains added user
                    db.collection("groups")
                      .doc(groupId)
                      .update({
                        members: Firebase.firestore.FieldValue.arrayUnion(
                          userName
                        ),
                      });
                    // clear texr input screen, add user to screen via state
                    self.textInput.clear();
                    const groupMem = [];
                    for (var i = 0; i < self.state.groupMembers.length; i++) {
                      groupMem.push(self.state.groupMembers[i]);
                    }
                    groupMem.push(userName);
                    self.setState({ groupMembers: groupMem });
                  })
                  .catch((error) => console.log(error));
              } else {
                // if the user is already in the  group - alert
                Alert.alert("Oops!", "This user is already in the group", [
                  { text: "ok" },
                ]);
              }
            })
            .catch((error) => console.log(error));
        } else {
          // id the  user is not in our database - alert
          Alert.alert("Oops!", "This user does not exist", [{ text: "ok" }]);
        }
      })
      .catch((error) => console.log(error));
  };

  // deletes current user from a group
  deleteGroup(group, groupId) {
    
    db.collection('users').doc(this.state.user.email).update({
      groups: Firebase.firestore.FieldValue.arrayRemove({
        id: groupId,
        name: group
      })
    }).then( ()  => {
      
      db.collection('groups').doc(groupId).update({
        members: Firebase.firestore.FieldValue.arrayRemove(this.state.user.email)
      })
    }).then(() => {
      const newGroups = this.state.groups
      for(var i = 0; i < newGroups.length; i++) {
        if(newGroups[i].id == groupId) {
          newGroups.splice(i, 1)
        }
      }
      this.setState({groups: newGroups})

      
      // maybe look in to a better way of doing this?
      db.collection('groups').doc(groupId).get().then( function(doc) {
        if(doc.data().members.length < 1) {
          db.collection('groups').doc(groupId).delete().then( () => console.log('doc deleted'))
        }
      })
    }) 
    .catch((error) => console.log(error)).catch((error) => console.log(error))
    this.setState({groupModalOpen: false})

  }

  // called when the component launches/mounts
  // this is like a react native method that automatically gets called
  //  when the component  mounts
  componentDidMount() {
    // get the user's document from collection
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // get the  groups from the user's doc - store in some state to display
          const groupsData = [];
          for (var i = 0; i < doc.data().groups.length; i++) {
            groupsData.push({
              name: doc.data().groups[i].name,
              id: doc.data().groups[i].id,
              //key: i,
            });
          }
          this.setState({ groups: groupsData });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* *********** CREATE NEW GROUP MODAL *********** */}
        <Modal visible={this.state.createModalOpen} animationType="slide">
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={appStyles.modalContainer}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                onPress={() => this.setState({ createModalOpen: false })}
              />
              <Text style={styles.logo}>Create Group</Text>
              <View style={appStyles.inputView}>
                <TextInput
                  style={appStyles.inputText}
                  placeholder="Group name..."
                  placeholderTextColor="#003f5c"
                  onChangeText={(text) => {
                    this.setState({ groupName: text });
                  }}
                />
              </View>
              <TouchableOpacity
                style={appStyles.loginBtn}
                onPress={() =>
                  this.createGroup(this.state.groupName, this.user)
                }
              >
                <Text style={appStyles.buttonText}> Create group </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* *********** INDIVIDUAL GROUP MODAL *********** */}
        <Modal visible={this.state.groupModalOpen} animationType="slide">
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={appStyles.modalContainer}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                onPress={() => this.setState({ groupModalOpen: false })}
              />
              <MaterialIcons name = 'delete' size={24} 
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }} color='#333' 
                onPress={() => this.deleteGroup(this.state.groupNameClicked, this.state.groupIdClicked)}
                
              />
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{ ...styles.logo, ...{ marginTop: 5 } }}
              >
                {this.state.groupNameClicked}
              </Text>

              <View style={appStyles.inputView}>
                <TextInput
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  style={appStyles.inputText}
                  placeholder="add friends ..."
                  placeholderTextColor="#003f5c"
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    this.setState({ addUser: text });
                  }}
                />
              </View>
              <TouchableOpacity
                style={{ ...appStyles.loginBtn, ...{ marginTop: 10 } }}
                onPress={() =>
                  this.addUser(this.state.addUser, this.state.groupIdClicked)
                }
              >
                <Text style={appStyles.buttonText}> add member</Text>
              </TouchableOpacity>

              <Text style={styles.wordText}>Members:</Text>
              <ScrollView style={{ width: "95%" }}>
                {this.state.groupMembers &&
                  this.state.groupMembers.map((person) => {
                    return (
                      <TouchableOpacity style={styles.alarmBanner} key={person} >
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          // allowFontScaling
                          style={styles.memberText}
                        >
                          {person}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* *********** ACTUAL PAGE *********** */}

        <View style={styles.center}>
          <Text style={styles.logo}>Groups</Text>
        </View>

        <MaterialIcons
          name="add"
          size={24}
          style={appStyles.modalToggle}
          onPress={() => this.setState({ createModalOpen: true })}
        />
        <ScrollView
          //indicatorStyle='white'
          style={{ width: "95%" }}
        >
          {this.state.groups &&
            this.state.groups.map((group) => {
              return (
                <TouchableOpacity
                  style={styles.alarmBanner}
                  key={group.id}
                  onPress={() => this.groupModal(group.name, group.id)}
                >
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.alarmText}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  wordText: {
    color: APPTEXTWHITE,
    fontSize: 20,
    padding: 10,
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

  // lol bad name - the  button text
  alarmText: {
    color: APPTEXTWHITE,
    fontSize: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },

  //  text in indiv group modal - members
  memberText: {
    color: APPTEXTWHITE,
    fontSize: 22,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },

  logo: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 18,
    alignItems: "center",
  },

  //  old  group card stuff
  groupCard: {
    //marginBottom: 20,
    //borderWidth: 1,
    borderColor: APPTEXTRED,
    padding: 10,
    alignSelf: "center",
    color: APPTEXTRED,
    fontSize: 24,
    alignItems: "flex-start",
  },

  center: {
    alignItems: "center",
  },

  // old group card stuff
  groups: {
    alignItems: "flex-start",
    borderRadius: 6,
    marginLeft: 16,
    elevation: 3,
    backgroundColor: APPBACKGROUNDCOLOR,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#031821",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
});
