// Feel free to add to this style sheet so we can make the screens consistent throughout our app

import { StyleSheet, Dimensions } from "react-native";
import {
  APPBACKGROUNDCOLOR,
  APPTEXTRED,
  APPTEXTWHITE,
  APPINPUTVIEW,
  APPTEXTBLUE,
} from "./constants";

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
  },

  loginContainer: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: 45,
    color: APPTEXTRED,
    marginTop: 30,
    marginBottom: 40,
    alignItems: "center",
  },

  inputView: {
    width: "75%",
    backgroundColor: APPBACKGROUNDCOLOR,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },

  inputText: {
    fontSize: 16,
    height: 50,
    color: APPINPUTVIEW,
  },

  forgot: {
    color: APPTEXTBLUE,
    fontSize: 13,
  },

  loginText: {
    color: APPTEXTBLUE,
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
    // borderWidth: 1,
    borderColor: APPTEXTRED,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,

    color: APPTEXTRED,
  },

  modalContainer: {
    backgroundColor: APPBACKGROUNDCOLOR,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
    paddingTop: 10,
  },

  modalClose: {
    alignSelf: "flex-end",
    marginTop: 30,
    marginBottom: 0,
  },

  buttonText: {
    color: APPTEXTWHITE,
    fontSize: 16,
    padding: 10,
  },
  
  groupsLogo: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 50,
    color: APPTEXTRED,
    marginBottom: 18,
    alignItems: "center",
  },
});


// ********** NEW STYLESHEET **********

const alarmStyles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: APPBACKGROUNDCOLOR,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
  },

  topBanner: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: APPBACKGROUNDCOLOR,
    height: 100,
    paddingTop: 0,
    paddingBottom: 0,
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },

  Text: {
    height: 50,
    color: APPTEXTWHITE,
    fontSize: 16,
  },

  pageTitle: {
    padding: 20,
    color: APPTEXTRED,
    fontSize: 50,
    fontWeight: "bold",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    padding: 20,
    color: APPTEXTRED,
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  alarmTime: {
    color: APPTEXTWHITE,
    fontSize: 40,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  alarmText: {
    color: APPTEXTWHITE,
    fontSize: 16,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  alarmBanner: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: "95%",
    borderRadius: 15,
  },

  alarmDetails: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    width: "100%",
    borderRadius: 15,
  },

  button: {
    width: 60,
    height: 60,
    backgroundColor:"#465881",
    alignItems: 'center',
    justifyContent:"center",
    borderRadius: 30,
    marginBottom: 20,
    padding: 20
  },
  
  backTextWhite: {
    color: "#FFF",
  },

  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    width: "95%",
  },

  backLeftBtn:{
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 90,
    backgroundColor: '#56D945',
    left: 20,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },

  backRightBtnCenter: {
      backgroundColor: 'grey',
      right: 75,
      marginTop: 0,
      marginBottom: 10,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
  },

  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
      marginTop: 0,
      marginBottom: 10,
      paddingTop: 0,
      paddingBottom: 0,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
  },
  trash: {
      height: 25,
      width: 25,
  },
});

const profileStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    // these lines fit the container to the entire screen
    //height: Dimensions.get('window').height,
    // width: Dimensions.get('window').width,
    // marginLeft: 0,
  },
  scroll: {
    backgroundColor: 'white',

    // these lines fit the container to the entire screen
    // height: Dimensions.get('window').height,
    // width: Dimensions.get('window').width,
  },
  userRow: {
    alignItems: 'flex-start',
    // flexDirection: 'row',
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 15,
    paddingTop: 60,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 65,
    borderWidth: 0,
    borderColor: APPBACKGROUNDCOLOR,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 20,
    color: APPBACKGROUNDCOLOR,
    marginBottom: 5,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  loginBtn: {
    width: "80%",
    backgroundColor: APPTEXTRED,
    borderRadius: 15,
    height: 40,
    width: 0.75 * Dimensions.get('screen').width, // sign out button is 85% of the screen's width
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    marginLeft: 55,
  },
  birthdayBtn: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 70,
  },
})

export { appStyles, alarmStyles, profileStyles };
