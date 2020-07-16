// home.js
import React, { Component, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Modal,
} from "react-native";
import * as firebase from "firebase";

import { MaterialIcons } from "@expo/vector-icons";

export default function Groups({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  var db = firebase.firestore();
  var user = firebase.auth().currentUser;

  var data = []

  populateData = () => {
  firebase.firestore().collection('users').doc(user.email).get().then(function(doc) {
      for(var i=0; i < doc.data().groups.length; i++) {
        data.push(doc.data().groups[i])
      }
  })}

  createGroup = (name) => {
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
        .then(function(docRef) {
            setModalOpen(false)
            db.collection('users').doc(user.email).update({
                groups: firebase.firestore.FieldValue.arrayUnion({name: name, id: docRef})
            })
            })
        .catch(function(error) {
            console.log(error.toString())
        });
    }
  };

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  return (
    // populateData(),
    <View style={styles.container}>
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalOpen(false)}
          />
          <Text style={styles.text}>Create Group</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Group name..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => {
                setGroupName(text);
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => createGroup(groupName)}
          >
            <Text style={styles.buttonText}> Create group </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={styles.logo}>Groups</Text>

      <MaterialIcons
        name="add"
        size={24}
        style={styles.modalToggle}
        onPress={() => setModalOpen(true)}
      />
      <Text style={styles.buttonText}>hi</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 18,
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

  text: {
    color: "white",
    fontSize: 28,
    padding: 10,
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
});
