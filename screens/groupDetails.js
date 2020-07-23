import React, { Component } from "react";
import { StyleSheet, Button, View, Switch, Text } from "react-native";
import SwitchExample from "../components/toggleSwitch";

export default class HomeContainer extends Component {
  render() {
    return (
      <View>
        <SwitchExample />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
  },
});
