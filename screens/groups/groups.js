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
  APPINPUTVIEW,
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
      // info for group specific modal
      groupNameClicked: "",
      groupIdClicked: "",
      groupAdminClicked: "",
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

    // groupId  should alway be a string
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
          this.setState({ groupAdminClicked: doc.data().adminEmail });
        });
    }
    // this was for when groupId was a docRef, this shouldn't happen anymore
    // but keeping the code until the next merge to github just in case
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

  // called when user tries to add someone to a group
  addUser = (userName, groupId) => {
    //  this is needed - talk to anna to explain more
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
                      // clear text input
                      self.textInput.clear();
                      // update screen by updating local state
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
            // if the user is not in our database - alert
            Alert.alert("Oops!", "This user does not exist", [{ text: "ok" }]);
          }
        })
        .catch((error) => console.log(error));
    } else {
      // if nothing was entered in the text input - alert
      Alert.alert("Oops!", "This user does not exist", [{ text: "ok" }]);
    }
  };

  // called when admin wants to delete someone from a group
  deleteUser(group, groupId, userDeleted) {
    if (
      // if the person is not trying to delete themselves and is not the admin, return
      userDeleted != this.user.email &&
      this.user.email != this.state.groupAdminClicked
    ) {
      return;
    } else {
      //  double check with user - make sure they want to delete via alert
      Alert.alert(
        "Warning",
        "Are you sure you want to delete " + userDeleted + " from this group?",
        [
          { text: "No" },
          {
            text: "Yes",
            // if they  click yes, calls deleteGroup
            onPress: () => this.deleteGroup(group, groupId, userDeleted),
          },
        ]
      );
    }
  }

  // deletes a user from a group
  deleteGroup(group, groupId, userDeleted) {
    var self = this;

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
              db.collection("groups")
                .doc(groupId)
                .update({
                  members: Firebase.firestore.FieldValue.arrayRemove(
                    userDeleted
                  ),
                });
            }
          });
      })
      .then(() => {
        if (userDeleted == this.user.email) {
          // updating state if user is deleting themself
          // updates the groups displayed on main page
          const newGroups = self.state.groups;
          for (var i = 0; i < newGroups.length; i++) {
            if (newGroups[i].id == groupId) {
              newGroups.splice(i, 1);
            }
          }
          self.setState({ groups: newGroups });
          // close  modal (bc they aren't in the group anymore)
          self.setState({ groupModalOpen: false });
        } else {
          // updating state if admin deleted someone else
          // updates the members displayed on open modal
          const newMembers = self.state.groupMembers;
          for (var i = 0; i < newMembers.length; i++) {
            if (newMembers[i] == userDeleted) {
              newMembers.splice(i, 1);
            }
          }
          self.setState({ groupMembers: newMembers });
        }
      })
      .catch((error) => console.log(error))
      .catch((error) => console.log(error));
  }

  // hidden items in swipe list - from Sidney's code
  // for main page
  renderHiddenItem = (data, rowMap) => (
    // might take the first one out..
    <View style={alarmStyles.rowBack}>
      {/*
      <TouchableOpacity
        style={[alarmStyles.backLeftBtn]}
        onPress={() => console.log("Pressed share alarm with group button")}
      >
        <Text style={alarmStyles.backTextWhite}>+ Alarm</Text>
  </TouchableOpacity> */}

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
    // might take the first one out..
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

  // called when  user presses close
  // doesn't work fully for indiv group modal
  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

    // called when  user presses close
  // doesn't work fully for indiv group modal
  closeRowModal = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  // called when user  presses trash can (from Sidney's code)
  // for main page
  deleteRow = (rowMap, rowKey) => {
    this.closeRow(rowMap, rowKey);
    const prevIndex = this.state.groups.findIndex((item) => item.id === rowKey);
    const groupName = this.state.groups[prevIndex].name;

    Alert.alert(
      "Warning",
      "Are you sure you  want to delete yourself from this group?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () => this.deleteGroup(groupName, rowKey, this.user.email),
        },
      ]
    );
  };

  // called when user  presses trash can (from Sidney's code)
  // for indiv group modal
  deleteRowModal = (rowMap, rowKey) => {
    this.closeRow(rowMap, rowKey);
    console.log(rowKey);
    //const prevIndex = this.state.groups.findIndex((item) => item.id === rowKey);
    //const groupName = this.state.groups[prevIndex].name;
    console.log(this.state.groupNameClicked);

    Alert.alert(
      "Warning",
      "Are you sure you  want to delete " + rowKey + " from this group?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: () =>
            this.deleteGroup(
              this.state.groupNameClicked,
              this.state.groupIdClicked,
              rowKey
            ),
        },
      ]
    );
  };

  // idk what this does - from Sidney's code
  onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  // idk what this does - from Sidney's code
  onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;
  };

  // called when the component launches/mounts
  // this is like a react native method that automatically gets called
  //  when the component  mounts
  componentDidMount() {
    // get the user's document from collection
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        //  if the doc exists
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
    return (
      <View style={styles.container}>
        {/* **************************************** CREATE NEW GROUP MODAL **************************************** */}
        <Modal visible={this.state.createModalOpen} animationType="slide">
          {/* this allows for dismiss keyboard when tapping anywhere functionality */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={appStyles.modalContainer}>
              {/* close group modal icon */}
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                onPress={() => this.setState({ createModalOpen: false })}
              />
              <Text style={styles.logo}>Create Group</Text>
              {/* text input for create new group */}
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
              {/* create new group button */}
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

        {/* **************************************** INDIVIDUAL GROUP MODAL **************************************** */}
        <Modal visible={this.state.groupModalOpen} animationType="slide">
          {/* this allows for touch anywhere and keyboard dismisses functionality */}
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={appStyles.modalContainer}>
              {/* close indiv group modal button */}
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                onPress={() => this.setState({ groupModalOpen: false })}
              />
              {/* delete group button */}
              <MaterialIcons
                name="delete"
                size={24}
                style={{ ...appStyles.modalToggle, ...appStyles.modalClose }}
                color="#333"
                //onPress={() => this.deleteGroup(this.state.groupNameClicked, this.state.groupIdClicked)}
                onPress={() =>
                  Alert.alert(
                    "Warning",
                    "Are you sure you  want to delete yourself from this group?",
                    [
                      { text: "No" },
                      {
                        text: "Yes",
                        onPress: () =>
                          this.deleteGroup(
                            this.state.groupNameClicked,
                            this.state.groupIdClicked,
                            this.user.email
                          ),
                      },
                    ]
                  )
                }
              />
              {/* group name text */}
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={{ ...styles.logo, ...{ marginTop: 5 } }}
              >
                {this.state.groupNameClicked}
              </Text>

              {
                // text that says if someone is the admin
                /*(this.state.groupAdminClicked == this.user.email) && (
                <View>
                  <Text>you are the admin</Text>
                </View>
              ) */
              }

              {/* text input to add a group member */}
              <View style={appStyles.inputView}>
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
                style={{ ...appStyles.loginBtn, ...{ marginTop: 10 } }}
                onPress={() =>
                  this.addUser(this.state.addUser, this.state.groupIdClicked)
                }
              >
                <Text style={appStyles.buttonText}> add member</Text>
              </TouchableOpacity>

              {/* number of members in the group text */}
              <Text style={styles.wordText}>
                Members: {this.state.groupMembers.length}
              </Text>

              {/* text that displays who the admin is */}
              <Text style={styles.wordText}>
                Admin: {this.state.groupAdminClicked}
              </Text>
              {
                // IF USER  IS NOT ADMIN
                // displays ScrollView of group members
                this.user.email != this.state.groupAdminClicked && (
                  <ScrollView style={{ width: "95%" }}>
                    {this.state.groupMembers &&
                      this.state.groupMembers.map((person) => {
                        return (
                          // "button"  that displays group members
                          <TouchableHighlight
                            underlayColor={APPINPUTVIEW}
                            style={styles.alarmBanner}
                            key={person}
                          >
                            <Text
                              adjustsFontSizeToFit
                              numberOfLines={1}
                              // allowFontScaling
                              style={styles.memberText}
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
                this.user.email == this.state.groupAdminClicked && (
                  <SwipeListView
                    style={{ width: "95%" }}
                    underlayColor={APPINPUTVIEW}
                    keyExtractor={(item) => item} // specifying id as the key to prevent the key warning
                    data={this.state.groupMembers}
                    renderItem={({ item }) => (
                      // button that contains user's name
                      <TouchableHighlight style={styles.alarmBanner}>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={styles.memberText}
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

        {/* **************************************** ACTUAL PAGE ************************************************* */}

        <View style={styles.center}>
          <Text style={styles.logo}>Groups</Text>
        </View>

        {/* add new group button */}
        <MaterialIcons
          name="add"
          size={24}
          style={appStyles.modalToggle}
          onPress={() => this.setState({ createModalOpen: true })}
        />
        {/*
        // this is my old code if we wanna bring it back ever
        // for scrollview list of groups (instead of swipe list)
        <ScrollView style={{ width: "95%" }}>
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
          </ScrollView> */}

        {/* swipelist of all groups user is in */}
        <SwipeListView
          style={{ width: "95%" }}
          keyExtractor={(item) => item.id} // specifying id as the key to prevent the key warning
          data={this.state.groups}
          renderItem={({ item }) => (
            // buttons for what groups user is in
            <TouchableHighlight
              // color when clicked
              underlayColor={APPINPUTVIEW}
              style={styles.alarmBanner}
              onPress={() => this.groupModal(item.name, item.id)}
            >
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.alarmText}
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

  // lol bad name - the button text
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

  logo: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 18,
    alignItems: "center",
  },

  // old group card stuff
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
