// Feel free to add to this style sheet so we can make the screens consistent throughout our app

import { StyleSheet } from "react-native";
import { APPBACKGROUNDCOLOR, APPTEXTRED, APPTEXTWHITE, APPINPUTVIEW } from "./constants";

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 10,
  },

  loginContainer: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 40,
  },

  inputView: {
    width: "80%",
    backgroundColor: APPINPUTVIEW,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  inputText: {
    height: 50,
    color: APPTEXTWHITE,
  },

  forgot: {
    color: APPTEXTWHITE,
    fontSize: 13,
  },

  loginText: {
    color: APPTEXTWHITE,
    fontSize: 15,
  },

  loginBtn: {
    width: "80%",
    backgroundColor: APPTEXTRED,
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
    borderColor: APPTEXTRED,
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    color: APPTEXTRED,
  },

  modalContainer: {
    backgroundColor: APPBACKGROUNDCOLOR,
    flex: 1,
    alignItems: "center",
    padding: 15,
    paddingTop: 0,
  },

  modalClose: {
    marginTop: 50,
    marginBottom: 0,
  },
});

export { appStyles };
