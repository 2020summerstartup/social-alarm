// firebase stuff

import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyA2J1UBQxi63ZHx3-WN7C2pTOZRh1MJ3bI",
  authDomain: "social-alarm-2b903.firebaseapp.com",
  databaseURL: "https://social-alarm-2b903.firebaseio.com",
  projectId: "social-alarm-2b903",
  storageBucket: "social-alarm-2b903.appspot.com",
  messagingSenderId: "828360870887",
  appId: "1:828360870887:web:8d203554e5b469c1dd8b42",
  measurementId: "G-KXCXV485FZ",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;
