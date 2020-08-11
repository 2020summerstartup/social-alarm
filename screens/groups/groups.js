// home.js
import React, { Component } from "react";
// not sure if I need this import
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
  Image,
  TouchableHighlight,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Firebase from "../../firebase/firebase";
import { db, auth } from "../../firebase/firebase";

import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import {
  APPBACKGROUNDCOLOR,
  APPTEXTRED,
  APPTEXTWHITE,
  APPTEXTBLUE,
  APPINPUTVIEW,
} from "../../style/constants";
import { appStyles, alarmStyles } from "../../style/stylesheet";
import { NotificationContext } from "../../contexts/NotificationContext";

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
      // info for group specific modal
      groupNameClicked: "",
      groupIdClicked: "",
      groupAdminClicked: "",
      groupMembers: [],
      // the text input in add user field of group specific modal
      addUser: "",
    };
  }

  // context (global state) stuff
  static contextType = NotificationContext;

  // current user
  user = auth.currentUser;

  // called when user hits create group button in create group modal
  // creates a group in firebase and adds it to local state
  createGroup = (name, user) => {
    // if group length is too small - no group made, instead alert
    if (name.length < 3) {
      Alert.alert("Oops!", "Group name must be at least 3 characters long", [
        { text: "OK" },
      ]);
    } else {
      // add group to group collection with relevant info
      db.collection("groups")
        .add({
          groupName: name,
          adminEmail: user.email,
          members: [user.email],
          alarms: [],
        })
        .then((docRef) => {
          // modal closes
          this.setState({ createModalOpen: false });

          // add  group to user's doc
          db.collection("users")
            .doc(user.email)
            .update({
              // pushes new element to groups array in firebase
              groups: Firebase.firestore.FieldValue.arrayUnion({
                name: name,
                id: docRef.id,
              }),
            });
          // update user's groups in local state
          var groupData = [];
          for (var i = 0; i < this.state.groups.length; i++) {
            groupData.push(this.state.groups[i]);
          }
          groupData.push({
            name: name,
            id: docRef.id,
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
        this.setState({ groupAdminClicked: doc.data().adminEmail });
      });
  };

  // called when user tries to add someone to a group
  // adds user the group (provided they can be added),
  // adds this to user's notifications, and updates local state
  addUserToGroup = (userName, groupId) => {
    //  this is needed, not totally sure why (see stack overfloe below) -anna
    // https://stackoverflow.com/questions/39191001/setstate-with-firebase-promise-in-react
    var self = this;
    if (userName) {
      // find's user's doc (doc)
      db.collection("users")
        .doc(userName)
        .get()
        .then(function (doc) {
          // if that is a real user in our system
          if (doc.exists) {
            // get group doc (doc2)
            db.collection("groups")
              .doc(groupId)
              .get()
              .then(function (doc2) {
                // if the user is not already in the group
                if (doc2.data().members.indexOf(userName) == -1) {
                  // update all local state here

                  // clear text input
                  self.textInput.clear();
                  // dismisses the keyboard
                  Keyboard.dismiss();

                  // update screen by updating local state
                  const groupMem = [];
                  for (var i = 0; i < self.state.groupMembers.length; i++) {
                    groupMem.push(self.state.groupMembers[i]);
                  }
                  groupMem.push(userName);
                  self.setState({ groupMembers: groupMem });

                  // update added user's document so it contains new group info
                  // also add a notification for user in their notifications
                  db.collection("users")
                    .doc(userName)
                    .update({
                      groups: Firebase.firestore.FieldValue.arrayUnion({
                        name: doc2.data().groupName,
                        id: doc2.id,
                      }),
                      notifications: Firebase.firestore.FieldValue.arrayUnion({
                        title: "New Group!",
                        body:
                          self.user.email +
                          ' has added you to the group "' +
                          doc2.data().groupName +
                          '"',
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
                    })
                    .catch((error) => console.log(error));
                } else {
                  // if the user is already in the  group - alert
                  Alert.alert("Oops!", "This user is already in the group", [
                    { text: "OK" },
                  ]);
                }
              })
              .catch((error) => console.log(error));
          } else {
            // if the user is not in our database - alert
            Alert.alert("Oops!", "This user does not exist", [{ text: "OK" }]);
          }
        })
        .catch((error) => console.log(error));
    } else {
      // if nothing was entered in the text input - alert
      Alert.alert("Oops!", "Please enter a valid email address", [
        { text: "OK" },
      ]);
    }
  };

  // deletes a user from a group
  // called when user deletes themself from a group OR
  // admin deletes someone from a group
  deleteUserFromGroup(group, groupId, userDeleted) {
    if(userDeleted == this.user.email) {
      this.deleteSelfFromGroup(group, groupId);
      return;
    }
    var self = this;

    // updating state if admin deleted someone else
    // updates the members displayed on open modal
    const newMembers = self.state.groupMembers;
    for (var i = 0; i < newMembers.length; i++) {
      if (newMembers[i] == userDeleted) {
        newMembers.splice(i, 1);
      }
    }
    self.setState({ groupMembers: newMembers });

    // user side firebase (delete's group from user's doc)
    db.collection("users")
      .doc(userDeleted)
      .update({
        groups: Firebase.firestore.FieldValue.arrayRemove({
          id: groupId,
          name: group,
        }),
        notifications: Firebase.firestore.FieldValue.arrayUnion({
          title: "Group deleted",
          body:
            self.user.email + ' has deleted you from the group "' + group + '"',
        }),
      })
      .then(() => {
        // group side firebase (deletes user from group's doc)
        db.collection("groups")
          .doc(groupId)
          .get()
          .then(function (doc) {
            // if they are the last member in the group, delete the group document
            if (doc.data().members.length <= 1) {
              db.collection("groups")
                .doc(groupId)
                .delete()
                .then(() => console.log("doc deleted"));
            } else {
                db.collection("groups")
                  .doc(groupId)
                  .update({
                    members: Firebase.firestore.FieldValue.arrayRemove(
                      userDeleted
                    ),
                  });
              }
            }
          );
      })
      .catch((error) => console.log(error))
      .catch((error) => console.log(error));
  }

  // deletes a user from a group
  // called when user deletes themself from a group
  deleteSelfFromGroup(group, groupId) {
    var self = this;
    var userDeleted = this.user.email;

    // updates state - the groups displayed on main page
    const newGroups = self.state.groups;
    for (var i = 0; i < newGroups.length; i++) {
      if (newGroups[i].id == groupId) {
        newGroups.splice(i, 1);
      }
    }
    self.setState({ groups: newGroups });
    // close modal (bc they aren't in the group anymore)
    self.setState({ groupModalOpen: false });

    // user side firebase (delete's group from user's doc)
    db.collection("users")
      .doc(userDeleted)
      .update({
        groups: Firebase.firestore.FieldValue.arrayRemove({
          id: groupId,
          name: group,
        }),
      })
      .then(() => {
        // group side firebase (deletes user from group's doc)
        db.collection("groups")
          .doc(groupId)
          .get()
          .then(function (doc) {
            // if they are the last member in the group, delete the group document
            if (doc.data().members.length <= 1) {
              db.collection("groups")
                .doc(groupId)
                .delete()
                .then(() => console.log("doc deleted"));
            } else {
              // else just remove the user from the group's doc
              if (userDeleted == doc.data().adminEmail) {
                // if admin is deleted - choose new admin
                var newAdmin = doc.data().members[1];
                db.collection("groups")
                  .doc(groupId)
                  .update({
                    adminEmail: newAdmin,
                    members: Firebase.firestore.FieldValue.arrayRemove(
                      userDeleted
                    ),
                  });
                // give new admin a lil notification now
                db.collection("users")
                  .doc(newAdmin)
                  .update({
                    notifications: Firebase.firestore.FieldValue.arrayUnion({
                      title: "Congrats!",
                      body: "You are now the admin of group " + group,
                    }),
                  });
              } else {
                // else just delete user from groups doc
                db.collection("groups")
                  .doc(groupId)
                  .update({
                    members: Firebase.firestore.FieldValue.arrayRemove(
                      userDeleted
                    ),
                  });
              }
            }
          });
      })
      .catch((error) => console.log(error))
      .catch((error) => console.log(error));
  }

  // called when admin wants to delete a group
  // deletes group doc,the group from all members user doc, and updates local state
  deleteGroup(group, groupId) {
    var self = this;

    // updates the groups displayed on main page - state stuff
    const newGroups = self.state.groups;
    for (var i = 0; i < newGroups.length; i++) {
      if (newGroups[i].id == groupId) {
        newGroups.splice(i, 1);
      }
    }
    self.setState({ groups: newGroups });
    self.setState({ groupModalOpen: false });

    // get group doc
    db.collection("groups")
      .doc(groupId)
      .get()
      .then(function (doc) {
        // get group members
        const groupMembers = doc.data().members;
        // go through all member's user doc and delete that group
        for (var i = 0; i < groupMembers.length; i++) {
          // admin shouldn't get this alert since they deleted the group
          if (groupMembers[i] != doc.data().adminEmail) {
            // delete group from user's doc
            // also add a notification to user
            db.collection("users")
            .doc(groupMembers[i])
            .update({
              groups: Firebase.firestore.FieldValue.arrayRemove({
                id: groupId,
                name: group,
              }),
              notifications: Firebase.firestore.FieldValue.arrayUnion({
                title: "Group deleted",
                body: self.user.email + ' has deleted the group "' + group + '"',
              }),
            });
          } else {

            // delete group from user's doc
          // also add a notification to user
          db.collection("users")
          .doc(groupMembers[i])
          .update({
            groups: Firebase.firestore.FieldValue.arrayRemove({
              id: groupId,
              name: group,
            })
          });
          }
        }
        // delete group doc
        db.collection("groups").doc(groupId).delete();
      });
  }

  // hidden items in swipe list - from Sidney's code
  // for main page
  renderHiddenItem = (data, rowMap) => (
    <View style={alarmStyles.rowBack}>
      <TouchableOpacity
        style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnCenter]}
        onPress={() => this.closeRow(rowMap, data.item.id)}
      >
        <Text style={alarmStyles.backTextWhite}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnRight]}
        onPress={() => this.deleteRow(rowMap, data.item.id)}
      >
        <View style={[alarmStyles.trash]}>
          <Image
            source={require("../../assets/trash.png")}
            style={alarmStyles.trash}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  // hidden items in swipe list - from Sidney's code
  // for indiv group modal
  renderHiddenItemModal = (data, rowMap) => (
    <View style={alarmStyles.rowBack}>
      <TouchableOpacity
        style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnCenter]}
        onPress={() => this.closeRowModal(rowMap, data.item)}
      >
        <Text style={alarmStyles.backTextWhite}>Close</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[alarmStyles.backRightBtn, alarmStyles.backRightBtnRight]}
        onPress={() => this.deleteRowModal(rowMap, data.item)}
      >
        <View style={[alarmStyles.trash]}>
          <Image
            source={require("../../assets/trash.png")}
            style={alarmStyles.trash}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  // called when user presses close on main page
  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  // called when user presses close on indiv group modal
  closeRowModal = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  // called when user presses trash can (from Sidney's code)
  // for main page
  deleteRow = (rowMap, rowKey) => {
    this.closeRow(rowMap, rowKey);
    const prevIndex = this.state.groups.findIndex((item) => item.id === rowKey);
    const groupName = this.state.groups[prevIndex].name;

    Alert.alert(
      "Warning",
      "Are you sure you  want to delete yourself from this group?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => this.deleteUserFromGroup(groupName, rowKey, this.user.email),
        },
      ]
    );
  };

  // called when user presses trash can (from Sidney's code)
  // for indiv group modal
  deleteRowModal = (rowMap, rowKey) => {
    this.closeRow(rowMap, rowKey);

    // if the person is not trying to delete themselves and is not the admin, return
    if (
      rowKey != this.user.email &&
      this.user.email != this.state.groupAdminClicked
    ) {
      return;
    } else {
      // double check with user - make sure they want to delete via alert
      Alert.alert(
        "Warning",
        "Are you sure you want to delete " + rowKey + " from this group?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            // if they  click yes, calls deleteUserFromGroup
            onPress: () =>
              this.deleteUserFromGroup(
                this.state.groupNameClicked,
                this.state.groupIdClicked,
                rowKey
              ),
          },
        ]
      );
    }
  };

  // idk what this does - from Sidney's code
  onRowDidOpen = (rowKey) => {
    //console.log("This row opened", rowKey);
  };

  // idk what this does - from Sidney's code
  onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
  };

  // called when the component launches/mounts
  // sets up all local state
  componentDidMount() {
    // get the user's document from collection
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        // if the doc exists
        if (doc.exists) {
          // get the  groups from the user's doc - store in some state to display
          const groupsData = [];
          for (var i = 0; i < doc.data().groups.length; i++) {
            groupsData.push({
              name: doc.data().groups[i].name,
              id: doc.data().groups[i].id,
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
    // context (global state) stuff
    const { isDarkMode, light, dark } = this.context;

    const theme = isDarkMode ? dark : light;

    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.APPBACKGROUNDCOLOR,
        }}
      >
        {/* **************************************** CREATE NEW GROUP MODAL *************************************************** */}
        <Modal visible={this.state.createModalOpen} animationType="slide">
          {/* this allows for dismiss keyboard when tapping anywhere functionality */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                ...appStyles.modalContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
            >
              {/* close group modal icon */}
              <MaterialIcons
                name="close"
                size={24}
                style={{
                  ...appStyles.modalToggle,
                  ...appStyles.modalClose,
                  color: theme.APPTEXTRED,
                }}
                onPress={() => this.setState({ createModalOpen: false })}
              />
              <Text
                style={{ ...appStyles.groupsLogo, color: theme.APPTEXTRED }}
              >
                Create Group
              </Text>
              {/* text input for create new group */}
              <View
                style={{
                  ...appStyles.inputView,
                  backgroundColor: theme.APPINPUTVIEW,
                }}
              >
                <TextInput
                  style={{ ...appStyles.inputText }}
                  placeholder="group name..."
                  placeholderTextColor="#003f5c"
                  onChangeText={(text) => {
                    this.setState({ groupName: text });
                  }}
                />
              </View>
              {/* create new group button */}
              <TouchableOpacity
                style={{
                  ...appStyles.loginBtn,
                  backgroundColor: theme.APPTEXTRED,
                }}
                onPress={() =>
                  this.createGroup(this.state.groupName.trim(), this.user)
                }
              >
                <Text style={appStyles.buttonText}> Create group </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* **************************************** INDIVIDUAL GROUP MODAL ************************************************* */}
        <Modal visible={this.state.groupModalOpen} animationType="slide">
          {/* this allows for touch anywhere and keyboard dismisses functionality */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View
              style={{
                ...appStyles.modalContainer,
                backgroundColor: theme.APPBACKGROUNDCOLOR,
              }}
            >
              <View style={styles.buttonContainer}>
                {/* delete group button */}
                {this.user.email == this.state.groupAdminClicked && (
                  <MaterialIcons
                    name="delete"
                    size={24}
                    style={{
                      ...appStyles.modalToggle,
                      ...appStyles.modalClose,
                      justifyContent: "flex-start",
                      color: theme.APPTEXTRED,
                    }}
                    onPress={() =>
                      Alert.alert(
                        "Warning",
                        "Are you sure you want to delete this group? This action is not reversable",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Yes",
                            style: "destructive",
                            onPress: () =>
                              this.deleteGroup(
                                this.state.groupNameClicked,
                                this.state.groupIdClicked
                              ),
                          },
                        ]
                      )
                    }
                  />
                )}

                {this.user.email != this.state.groupAdminClicked && (
                  //   i            i
                  <Text>            </Text>
                )}

                {/*                                                                     */}
                <Text>                                                                     </Text>

                {/* close indiv group modal button */}
                <MaterialIcons
                  name="close"
                  size={24}
                  style={{
                    ...appStyles.modalToggle,
                    ...appStyles.modalClose,
                    justifyContent: "flex-end",
                    color: theme.APPTEXTRED,
                  }}
                  onPress={() => this.setState({ groupModalOpen: false })}
                />
              </View>

              {/* group name text */}
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{
                  ...appStyles.groupsLogo,
                  marginTop: 5,
                  color: theme.APPTEXTRED,
                }}
              >
                {this.state.groupNameClicked}
              </Text>

              {/* text input to add a group member */}
              <View
                style={{
                  ...appStyles.inputView,
                  backgroundColor: theme.APPINPUTVIEW,
                }}
              >
                <TextInput
                  ref={(input) => {
                    this.textInput = input;
                  }}
                  style={appStyles.inputText}
                  placeholder="add group member..."
                  placeholderTextColor="#003f5c"
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    this.setState({ addUser: text });
                  }}
                />
              </View>
              {/* add member button */}
              <TouchableOpacity
                style={{
                  ...appStyles.loginBtn,
                  marginTop: 10,
                  backgroundColor: theme.APPTEXTRED,
                }}
                onPress={() =>
                  this.addUserToGroup(
                    this.state.addUser.trim(),
                    this.state.groupIdClicked
                  )
                }
              >
                <Text
                  style={{
                    ...appStyles.buttonText,
                    color: theme.APPTEXTWHITE,
                  }}
                >
                  add member
                </Text>
              </TouchableOpacity>

              {/* number of members in the group text */}
              <Text style={{ ...styles.wordText, color: theme.APPTEXTBLACK }}>
                Members: {this.state.groupMembers.length}
              </Text>

              {/* text that displays who the admin is */}
              <Text style={{ ...styles.wordText, color: theme.APPTEXTBLACK }}>
                Admin: {this.state.groupAdminClicked}
              </Text>
              {
                // IF USER IS NOT ADMIN
                // displays ScrollView of group members
                // (so user doesn't have swipe to delete functionality)
                this.user.email != this.state.groupAdminClicked && (
                  <ScrollView style={{ width: "95%" }}>
                    {this.state.groupMembers &&
                      this.state.groupMembers.map((person) => {
                        return (
                          // "button"  that displays group members
                          <TouchableHighlight
                            underlayColor={theme.APPBUTTONPRESS}
                            style={{
                              ...styles.banner,
                              backgroundColor: theme.APPTEXTRED,
                            }}
                            key={person}
                          >
                            <Text
                              adjustsFontSizeToFit
                              numberOfLines={1}
                              // allowFontScaling
                              style={{
                                ...styles.memberText,
                                color: theme.APPTEXTWHITE,
                              }}
                            >
                              {person}
                            </Text>
                          </TouchableHighlight>
                        );
                      })}
                  </ScrollView>
                )
              }

              {
                // IF USER IS ADMIN
                // displays a swipelist of all members in the group
                // (so admin has swipe to delete functionality)
                this.user.email == this.state.groupAdminClicked && (
                  <SwipeListView
                    style={{ width: "95%" }}
                    underlayColor={theme.APPBUTTONPRESS}
                    keyExtractor={(item) => item} // specifying id as the key to prevent the key warning
                    data={this.state.groupMembers}
                    renderItem={({ item }) => (
                      // button that contains user's name
                      <TouchableHighlight
                        style={{
                          ...styles.banner,
                          backgroundColor: theme.APPTEXTRED,
                        }}
                      >
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={{
                            ...styles.memberText,
                            color: theme.APPTEXTWHITE,
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableHighlight>
                    )}
                    renderHiddenItem={this.renderHiddenItemModal}
                    leftOpenValue={75}
                    rightOpenValue={-160}
                    previewRowKey={"0"}
                    previewOpenValue={-80}
                    previewOpenDelay={500}
                    onRowDidOpen={this.onRowDidOpen}
                    onSwipeValueChange={this.onSwipeValueChange}
                  />
                )
              }
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* **************************************** ACTUAL PAGE ********************************************************** */}

        <View style={{ alignItems: "center" }}>
          <Text style={{ ...appStyles.groupsLogo, color: theme.APPTEXTRED }}>
            Groups
          </Text>
        </View>

        {/* add new group button */}
        <MaterialIcons
          name="add"
          size={24}
          style={{ ...appStyles.modalToggle, color: theme.APPTEXTRED }}
          onPress={() => this.setState({ createModalOpen: true })}
        />

        {/* swipelist of all groups user is in */}
        <SwipeListView
          style={{ width: "95%" }}
          keyExtractor={(item) => item.id} // specifying id as the key to prevent the key warning
          data={this.state.groups}
          renderItem={({ item }) => (
            // buttons for what groups user is in
            <TouchableHighlight
              // color when clicked
              underlayColor={theme.APPBUTTONPRESS}
              style={{
                ...styles.banner,
                backgroundColor: theme.APPTEXTRED,
              }}
              onPress={() => this.groupModal(item.name, item.id)}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{ ...styles.groupNameText, color: theme.APPTEXTWHITE }}
              >
                {item.name}
              </Text>
            </TouchableHighlight>
          )}
          renderHiddenItem={this.renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-160}
          previewRowKey={"0"}
          previewOpenValue={-80}
          previewOpenDelay={500}
          onRowDidOpen={this.onRowDidOpen}
          onSwipeValueChange={this.onSwipeValueChange}
        />
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
    color: APPTEXTBLUE,
    fontSize: 20,
    padding: 10,
  },

  // the banner
  banner: {
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
  groupNameText: {
    color: APPTEXTWHITE,
    fontSize: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },

  // text in indiv group modal - members
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

  buttonContainer: {
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
});
