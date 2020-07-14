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
  // states - contains info that user entered
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  if (!firebase.apps.length) {
    firebase.initializeApp({});
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalOpen} animationType="slide">
        <View>
          <Text>hihi </Text>
          <MaterialIcons
            name="close"
            size={24}
            style={styles.modalToggle}
            onPress={() => setModalOpen(false)}
          />
        </View>
      </Modal>

      <Text style={styles.logo}>Groups</Text>

      <MaterialIcons
        name="add"
        size={24}
        style={styles.modalToggle}
        onPress={() => setModalOpen(true)}
      />

      {/* text input fields (email, password) */}
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

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* forgot password button */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* login button */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => this.loginUser(email, password)}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      {/* signup button */}
      <TouchableOpacity onPress={() => this.signUpUser()}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>
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
    marginBottom: 40,
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fb5b5a",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    color: "#fb5b5a",
  },
});
