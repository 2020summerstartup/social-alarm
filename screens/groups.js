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
} from "react-native";
import * as firebase from "firebase";
import { db, auth } from "./firebase";

import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";


export default class Groups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      groupName: "",
      groups: [
        {
          name: "number  1",
          key: "12345",
        },
        {
          name: "22222",
          key: "0832",
        },
      ],
      user: auth.currentUser,
    };
  }

  user = auth.currentUser;

  createGroup = (name, user) => {
    // firebase handling
    if (name.length < 3) {
      Alert.alert("Oops!", "Group name must be at least 3 characters long", [
        { text: "ok" },
      ]);
    } else {
      db.collection("groups")
        .add({
          groupName: name,
          adminId: user.uid,
          adminEmail: user.email,
          members: [user.email],
          alarms: [],
        })
        .then((docRef) => {
          this.setState({ modalOpen: false });

          db.collection("users")
            .doc(user.email)
            .update({
              groups: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                id: docRef,
              }),
            });
          groupData = this.state.groups;
          groupData.push({
            name: name,
            id: docRef,
            key: this.state.groups.length + 1
          })
          this.setState({groups: groupData})
        })
        .catch(function (error) {
          console.log(error.toString());
        });
    }
  };
  /*
  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }
  */

  componentDidMount() {
    // this.state.user.email instead of my email (not working for some reason)
    db.collection("users")
      .doc(auth.currentUser.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log(doc.data().groups[1].name)
          const groupsData = [];
          for (var i = 0; i < doc.data().groups.length; i++) {
            groupsData.push({
              name: doc.data().groups[i].name,
              id: doc.data().groups[i].id,
              key: i,
            });
          }
          //this.setState({groups: doc.data().groups})
          this.setState({ groups: groupsData });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      // populateData(),
      <View style={styles.container}>
        <Modal visible={this.state.modalOpen} animationType="slide">
          <View style={styles.modalContainer}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => this.setState({ modalOpen: false })}
            />
            <Text style={styles.logo}>Create Group</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholder="Group name..."
                placeholderTextColor="#003f5c"
                onChangeText={(text) => {
                  this.setState({ groupName: text });
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.createGroup(this.state.groupName, this.user)}
            >
              <Text style={styles.buttonText}> Create group </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.center}>
          <Text style={styles.logo}>Groups</Text>
        </View>

        <MaterialIcons
          name="add"
          size={24}
          style={styles.modalToggle}
          onPress={() => this.setState({ modalOpen: true })}
        />
        <ScrollView>
          {this.state.groups &&
            this.state.groups.map((group) => {
              return (
                <TouchableOpacity style={styles.groups} key={group.key}>
                  <Text style={styles.groupCard}>{group.name}</Text>
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
    backgroundColor: "#003f5c",
    //alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 18,
    alignItems: "center",
  },

  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
    padding: 20,
  },

  inputText: {
    height: 50,
    color: "white",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    padding: 10,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },

  modalToggle: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fb5b5a",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    color: "#fb5b5a",
  },

  modalContainer: {
    backgroundColor: "#003f5c",
    flex: 1,
    alignItems: "center",
  },

  modalClose: {
    marginTop: 30,
    marginBottom: 0,
  },

  groupCard: {
    //marginBottom: 20,
    //borderWidth: 1,
    borderColor: "#fb5b5a",
    padding: 10,

    alignSelf: "center",
    color: "#fb5b5a",
    fontSize: 24,
    alignItems: "flex-start",
  },

  center: {
    alignItems: "center",
  },

  groups: {
    alignItems: "flex-start",
    borderRadius: 6,
    marginLeft: 16,
    elevation: 3,
    backgroundColor: "#003f5c",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#031821",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
});
