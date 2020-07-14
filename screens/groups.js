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
import { render } from "react-dom";
import * as firebase from "firebase";
import { MaterialIcons } from "@expo/vector-icons";

export default function Groups({ navigation }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalOpen(false)}
          />
          <Text style={styles.loginText}>modallll</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email..."
              placeholderTextColor="#003f5c"
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
          </View>
        </View>
      </Modal>

      <Text style={styles.logo}>Groups</Text>

      <MaterialIcons
        name="add"
        size={24}
        style={styles.modalToggle}
        onPress={() => setModalOpen(true)}
      />
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
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  inputText: {
    height: 50,
    color: "white",
  },

  forgot: {
    color: "white",
    fontSize: 13,
  },

  loginText: {
    color: "white",
    fontSize: 15,
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
    //justifyContent: "center",
  },

  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
});
